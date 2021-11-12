import React, { useCallback, useMemo, useState } from 'react';
import { Col, Button, InputNumber, Spin } from 'antd';
import { MemoryRouter, Route, Redirect, Link } from 'react-router-dom';

import {
  useConnection,
  useUserAccounts,
  MetaplexModal,
  MetaplexOverlay,
  formatAmount,
  formatTokenAmount,
  useMint,
  PriceFloorType,
  AuctionDataExtended,
  ParsedAccount,
  getAuctionExtended,
  programIds,
  AuctionState,
  BidderMetadata,
  MAX_METADATA_LEN,
  MAX_EDITION_LEN,
  placeBid,
  useWalletModal,
  VaultState,
  BidStateType,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { AuctionView, useBidsForAuction, useUserBalance } from '../../hooks';
import { sendPlaceBid } from '../../actions/sendPlaceBid';
// import { bidAndClaimInstantSale } from '../../actions/bidAndClaimInstantSale';
import { AuctionNumbers } from './../AuctionNumbers';
import {
  sendRedeemBid,
  eligibleForParticipationPrizeGivenWinningIndex,
} from '../../actions/sendRedeemBid';
import { sendCancelBid } from '../../actions/cancelBid';
import { startAuctionManually } from '../../actions/startAuctionManually';
import BN from 'bn.js';
import { Confetti } from '../Confetti';
import { QUOTE_MINT } from '../../constants';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useMeta } from '../../contexts';
import moment from 'moment';
import { AccountLayout, MintLayout } from '@solana/spl-token';
import { findEligibleParticipationBidsForRedemption } from '../../actions/claimUnusedPrizes';
import { useInstantSaleState } from './hooks/useInstantSaleState';
import { endSale } from './utils/endSale';
import {
  BidRedemptionTicket,
  MAX_PRIZE_TRACKING_TICKET_SIZE,
  WinningConfigType,
} from '@oyster/common/dist/lib/models/metaplex/index';

async function calculateTotalCostOfRedeemingOtherPeoplesBids(
  connection: Connection,
  auctionView: AuctionView,
  bids: ParsedAccount<BidderMetadata>[],
  bidRedemptions: Record<string, ParsedAccount<BidRedemptionTicket>>,
): Promise<number> {
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span,
  );
  const mintRentExempt = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span,
  );
  const metadataRentExempt = await connection.getMinimumBalanceForRentExemption(
    MAX_METADATA_LEN,
  );
  const editionRentExempt = await connection.getMinimumBalanceForRentExemption(
    MAX_EDITION_LEN,
  );
  const prizeTrackingTicketExempt =
    await connection.getMinimumBalanceForRentExemption(
      MAX_PRIZE_TRACKING_TICKET_SIZE,
    );

  const eligibleParticipations =
    await findEligibleParticipationBidsForRedemption(
      auctionView,
      bids,
      bidRedemptions,
    );

  const { isInstantSale, canEndInstantSale } = useInstantSaleState(auctionView);

  const max = auctionView.auction.info.bidState.max.toNumber();
  let totalWinnerItems = 0;
  for (let i = 0; i < max; i++) {
    const winner = auctionView.auction.info.bidState.getWinnerAt(i);
    if (!winner) {
      break;
    } else {
      const bid = bids.find(b => b.info.bidderPubkey === winner);
      if (bid) {
        for (
          let j = 0;
          j < auctionView.auctionManager.safetyDepositBoxesExpected.toNumber();
          j++
        ) {
          totalWinnerItems += auctionView.auctionManager
            .getAmountForWinner(i, j)
            .toNumber();
        }
      }
    }
  }
  return (
    (mintRentExempt +
      accountRentExempt +
      metadataRentExempt +
      editionRentExempt +
      prizeTrackingTicketExempt) *
    (eligibleParticipations.length + totalWinnerItems)
  );
}

function useGapTickCheck(
  value: number | undefined,
  gapTick: number | null,
  gapTime: number,
  auctionView: AuctionView,
): boolean {
  return !!useMemo(() => {
    if (gapTick && value && gapTime && !auctionView.auction.info.ended()) {
      // so we have a gap tick percentage, and a gap tick time, and a value, and we're not ended - are we within gap time?
      const now = moment().unix();
      const endedAt = auctionView.auction.info.endedAt;
      if (endedAt) {
        const ended = endedAt.toNumber();
        if (now > ended) {
          const toLamportVal = value * LAMPORTS_PER_SOL;
          // Ok, we are in gap time, since now is greater than ended and we're not actually an ended auction yt.
          // Check that the bid is at least gapTick % bigger than the next biggest one in the stack.
          for (
            let i = auctionView.auction.info.bidState.bids.length - 1;
            i > -1;
            i--
          ) {
            const bid = auctionView.auction.info.bidState.bids[i];
            const expected = bid.amount.toNumber();
            if (expected < toLamportVal) {
              const higherExpectedAmount = expected * ((100 + gapTick) / 100);

              return higherExpectedAmount > toLamportVal;
            } else if (expected === toLamportVal) {
              // If gap tick is set, no way you can bid in this case - you must bid higher.
              return true;
            }
          }
          return false;
        } else {
          return false;
        }
      }
      return false;
    }
  }, [value, gapTick, gapTime, auctionView]);
}

function useAuctionExtended(
  auctionView: AuctionView,
): ParsedAccount<AuctionDataExtended> | undefined {
  const [auctionExtended, setAuctionExtended] =
    useState<ParsedAccount<AuctionDataExtended>>();
  const { auctionDataExtended } = useMeta();

  useMemo(() => {
    const fn = async () => {
      if (!auctionExtended) {
        const PROGRAM_IDS = programIds();
        const extendedKey = await getAuctionExtended({
          auctionProgramId: PROGRAM_IDS.auction,
          resource: auctionView.vault.pubkey,
        });
        const extendedValue = auctionDataExtended[extendedKey];
        if (extendedValue) setAuctionExtended(extendedValue);
      }
    };
    fn();
  }, [auctionDataExtended, auctionExtended, setAuctionExtended]);

  return auctionExtended;
}
