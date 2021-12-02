import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Row, Col, Layout, Spin, Button, Table, Image } from 'antd';
import {
  useArt,
  useAuction,
  AuctionView,
  useBidsForAuction,
  useUserBalance,
  useExtendedArt,
  processAccountsIntoAuctionView,
} from '../../hooks';
import { ArtContent } from '../../components/ArtContent';
import {
  useConnection,
  BidderMetadata,
  ParsedAccount,
  cache,
  BidderPot,
  fromLamports,
  useMint,
  getBidderPotKey,
  programIds,
  Bid,
  useUserAccounts,
  StringPublicKey,
  toPublicKey,
  WalletSigner,
  supabaseUpdateIsRedeemAuctionStatus,
  WRAPPED_SOL_MINT,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMeta } from '../../contexts';
import {
  getBidderKeys,
  getPayoutTicket,
  NonWinningConstraint,
  PayoutTicket,
  WinningConstraint,
} from '@oyster/common/dist/lib/models/metaplex/index';
import { Connection } from '@solana/web3.js';
import { settle } from '../../actions/settle';
import { MintInfo } from '@solana/spl-token';
import {
  ArtContainer,
  ArtContentStyle,
  ArtDetailsColumn,
  ArtDetailsHeader,
  ArtTitle,
  BillingLabel,
  BillingValue,
  ColumnBox,
  Container,
  GroupValue,
  OverflowYAuto,
  PaddingBox,
  StatusBillingLabel,
  StatusContainer,
  TotalAuctionGroupValue,
  TotalAuctionLabel,
  TotalAuctionValue,
} from './style';
import { ThreeDots } from '../../components/MyLoader';
import { BillingHistory } from '../../components/Details/TransactionHistory';
import ActionButton from '../../components/ActionButton';
import { uFlex } from '../../styles';
import { getPersonalEscrowAta } from '../../components/Notifications';
import { closePersonalEscrow } from '../../actions/closePersonalEscrow';
import { SpinnerStyle } from '../../components/Details/BidDetails/style';
const { Content } = Layout;

export const BillingView = () => {
  const { id } = useParams<{ id: string }>();
  const auctionView = useAuction(id);
  const connection = useConnection();
  const wallet = useWallet();
  const mint = useMint(auctionView?.auction.info.tokenMint);

  return auctionView && wallet && connection && mint ? (
    <InnerBillingView
      auctionView={auctionView}
      connection={connection}
      wallet={wallet}
      mint={mint}
    />
  ) : (
    <Spin />
  );
};

function getLosingParticipationPrice(
  el: ParsedAccount<BidderMetadata>,
  auctionView: AuctionView,
) {
  const nonWinnerConstraint =
    auctionView.auctionManager.participationConfig?.nonWinningConstraint;

  if (nonWinnerConstraint === NonWinningConstraint.GivenForFixedPrice)
    return (
      auctionView.auctionManager.participationConfig?.fixedPrice?.toNumber() ||
      0
    );
  else if (nonWinnerConstraint === NonWinningConstraint.GivenForBidPrice)
    return el.info.lastBid.toNumber() || 0;
  else return 0;
}

function useWinnerPotsByBidderKey(
  auctionView: AuctionView,
): Record<string, ParsedAccount<BidderPot>> {
  const [pots, setPots] = useState<Record<string, ParsedAccount<BidderPot>>>(
    {},
  );
  const PROGRAM_IDS = programIds();

  const winnersLength = auctionView.auctionManager.numWinners.toNumber();
  const auction = auctionView.auction;
  const winners = auction.info.bidState.bids;
  const truWinners = useMemo(() => {
    return [...winners].reverse().slice(0, winnersLength);
  }, [winners, winnersLength]);

  useEffect(() => {
    (async () => {
      const promises: Promise<{ winner: Bid; key: StringPublicKey }>[] =
        truWinners.map(winner =>
          getBidderPotKey({
            auctionProgramId: PROGRAM_IDS.auction,
            auctionKey: auction.pubkey,
            bidderPubkey: winner.key,
          }).then(key => ({
            key,
            winner,
          })),
        );
      const values = await Promise.all(promises);

      const newPots = values.reduce((agg, value) => {
        const el = cache.get(value.key) as ParsedAccount<BidderPot>;
        if (el) {
          agg[value.winner.key] = el;
        }

        return agg;
      }, {} as Record<string, ParsedAccount<BidderPot>>);

      setPots(newPots);
    })();
  }, [truWinners, setPots]);
  return pots;
}

function usePayoutTickets(
  auctionView: AuctionView,
): Record<string, { tickets: ParsedAccount<PayoutTicket>[]; sum: number }> {
  const { payoutTickets } = useMeta();
  const [foundPayoutTickets, setFoundPayoutTickets] = useState<
    Record<string, ParsedAccount<PayoutTicket>>
  >({});

  useEffect(() => {
    if (
      auctionView.items
        .flat()
        .map(i => i.metadata)
        .filter(i => !i).length
    ) {
      return;
    }
    const currFound = { ...foundPayoutTickets };
    // items are in exact order of winningConfigs + order of bid winners
    // when we moved to tiered auctions items will be array of arrays, remember this...
    // this becomes triple loop
    const prizeArrays = [
      ...auctionView.items,
      ...(auctionView.participationItem
        ? [[auctionView.participationItem]]
        : []),
    ];
    const payoutPromises: { key: string; promise: Promise<StringPublicKey> }[] =
      [];
    let total = 0;
    for (let i = 0; i < prizeArrays.length; i++) {
      const items = prizeArrays[i];
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        const creators = item.metadata?.info?.data?.creators || [];
        const recipientAddresses = creators
          ? creators
              .map(c => c.address)
              .concat([auctionView.auctionManager.authority])
          : [auctionView.auctionManager.authority];

        for (let k = 0; k < recipientAddresses.length; k++) {
          // Ensure no clashes with tickets from other safety deposits in other winning configs even if from same creator by making long keys
          const key = `${auctionView.auctionManager.pubkey}-${i}-${j}-${item.safetyDeposit.pubkey}-${recipientAddresses[k]}-${k}`;

          if (!currFound[key]) {
            payoutPromises.push({
              key,
              promise: getPayoutTicket(
                auctionView.auctionManager.pubkey,
                item === auctionView.participationItem ? null : i,
                item === auctionView.participationItem ? null : j,
                k < recipientAddresses.length - 1 ? k : null,
                item.safetyDeposit.pubkey,
                recipientAddresses[k],
              ),
            });
            total += 1;
          }
        }
      }
    }
    Promise.all(payoutPromises.map(p => p.promise)).then(
      (payoutKeys: StringPublicKey[]) => {
        payoutKeys.forEach((payoutKey: StringPublicKey, i: number) => {
          if (payoutTickets[payoutKey])
            currFound[payoutPromises[i].key] = payoutTickets[payoutKey];
        });

        setFoundPayoutTickets(pt => ({ ...pt, ...currFound }));
      },
    );
  }, [
    Object.values(payoutTickets).length,
    auctionView.items
      .flat()
      .map(i => i.metadata)
      .filter(i => !!i).length,
  ]);

  return Object.values(foundPayoutTickets).reduce(
    (
      acc: Record<
        string,
        { tickets: ParsedAccount<PayoutTicket>[]; sum: number }
      >,
      el: ParsedAccount<PayoutTicket>,
    ) => {
      if (!acc[el.info.recipient]) {
        acc[el.info.recipient] = {
          sum: 0,
          tickets: [],
        };
      }
      acc[el.info.recipient].tickets.push(el);
      acc[el.info.recipient].sum += el.info.amountPaid.toNumber();
      return acc;
    },
    {},
  );
}

export function useBillingInfo({ auctionView }: { auctionView: AuctionView }) {
  const { bidRedemptions, bidderMetadataByAuctionAndBidder } = useMeta();
  const auctionKey = auctionView.auction.pubkey;

  const [participationBidRedemptionKeys, setParticipationBidRedemptionKeys] =
    useState<Record<string, StringPublicKey>>({});

  const bids = useBidsForAuction(auctionView.auction.pubkey);

  const payoutTickets = usePayoutTickets(auctionView);
  const winners = [...auctionView.auction.info.bidState.bids]
    .reverse()
    .slice(0, auctionView.auctionManager.numWinners.toNumber());
  const winnerPotsByBidderKey = useWinnerPotsByBidderKey(auctionView);

  // Uncancelled bids or bids that were cancelled for refunds but only after redeemed
  // for participation
  const usableBids = bids.filter(
    b =>
      !b.info.cancelled ||
      bidRedemptions[
        participationBidRedemptionKeys[b.pubkey]
      ]?.info.getBidRedeemed(
        auctionView.participationItem?.safetyDeposit.info.order || 0,
      ),
  );

  let hasParticipation =
    auctionView.auctionManager.participationConfig !== undefined &&
    auctionView.auctionManager.participationConfig !== null;
  let participationEligible = hasParticipation ? usableBids : [];

  useMemo(async () => {
    const newKeys: Record<string, StringPublicKey> = {};

    for (let i = 0; i < bids.length; i++) {
      const o = bids[i];
      if (!participationBidRedemptionKeys[o.pubkey]) {
        newKeys[o.pubkey] = (
          await getBidderKeys(auctionView.auction.pubkey, o.info.bidderPubkey)
        ).bidRedemption;
      }
    }

    setParticipationBidRedemptionKeys({
      ...participationBidRedemptionKeys,
      ...newKeys,
    });
  }, [bids.length]);

  if (
    auctionView.auctionManager.participationConfig?.winnerConstraint ===
    WinningConstraint.NoParticipationPrize
  )
    // Filter winners out of the open edition eligible
    participationEligible = participationEligible.filter(
      // winners are stored by pot key, not bidder key, so we translate
      b => !winnerPotsByBidderKey[b.info.bidderPubkey],
    );

  const nonWinnerConstraint =
    auctionView.auctionManager.participationConfig?.nonWinningConstraint;

  const participationEligibleUnredeemable: ParsedAccount<BidderMetadata>[] = [];

  participationEligible.forEach(o => {
    const isWinner = winnerPotsByBidderKey[o.info.bidderPubkey];
    // Winners automatically pay nothing for open editions, and are getting claimed anyway right now
    // so no need to add them to list
    if (isWinner) {
      return;
    }

    if (
      nonWinnerConstraint === NonWinningConstraint.GivenForFixedPrice ||
      nonWinnerConstraint === NonWinningConstraint.GivenForBidPrice
    ) {
      const key = participationBidRedemptionKeys[o.pubkey];
      if (key) {
        const redemption = bidRedemptions[key];
        if (
          !redemption ||
          !redemption.info.getBidRedeemed(
            auctionView.participationItem?.safetyDeposit.info.order || 0,
          )
        )
          participationEligibleUnredeemable.push(o);
      } else participationEligibleUnredeemable.push(o);
    }
  });

  const participationUnredeemedTotal = participationEligibleUnredeemable.reduce(
    (acc, el) => (acc += getLosingParticipationPrice(el, auctionView)),
    0,
  );

  // Winners always get it for free so pay zero for them - figure out among all
  // eligible open edition winners what is the total possible for display.
  const participationPossibleTotal = participationEligible.reduce((acc, el) => {
    const isWinner = winnerPotsByBidderKey[el.info.bidderPubkey];
    let price = 0;
    if (!isWinner) price = getLosingParticipationPrice(el, auctionView);

    return (acc += price);
  }, 0);

  const totalWinnerPayments = winners.reduce(
    (acc, w) => (acc += w.amount.toNumber()),
    0,
  );

  const winnersThatCanBeEmptied = Object.values(winnerPotsByBidderKey).filter(
    p => !p.info.emptied,
  );

  const bidsToClaim: {
    metadata: ParsedAccount<BidderMetadata>;
    pot: ParsedAccount<BidderPot>;
  }[] = [
    ...winnersThatCanBeEmptied.map(pot => ({
      metadata:
        bidderMetadataByAuctionAndBidder[`${auctionKey}-${pot.info.bidderAct}`],
      pot,
    })),
  ];

  return {
    bidsToClaim,
    totalWinnerPayments,
    payoutTickets,
    participationEligible,
    participationPossibleTotal,
    participationUnredeemedTotal,
    hasParticipation,
  };
}

export const InnerBillingView = ({
  auctionView,
  wallet,
  connection,
  mint,
}: {
  auctionView: AuctionView;
  wallet: WalletSigner;
  connection: Connection;
  mint: MintInfo;
}) => {
  const id = auctionView.thumbnail.metadata.pubkey;
  const art = useArt(id);
  const balance = useUserBalance(auctionView.auction.info.tokenMint);
  const [confirmTrigger, setConfirmTrigger] = useState(false);
  const [escrowBalance, setEscrowBalance] = useState<number | undefined>();
  const [escrowBalanceRefreshCounter, setEscrowBalanceRefreshCounter] =
    useState(0);
  const { whitelistedCreatorsByCreator, pullBillingPage, pullAuctionPage } =
    useMeta();

  const { ref, data } = useExtendedArt(id);

  useEffect(() => {
    pullBillingPage(id);
  }, []);

  useEffect(() => {
    connection
      .getTokenAccountBalance(
        toPublicKey(auctionView.auctionManager.acceptPayment),
      )
      .then(resp => {
        if (resp.value.uiAmount !== undefined && resp.value.uiAmount !== null)
          setEscrowBalance(resp.value.uiAmount);
      });
  }, [escrowBalanceRefreshCounter]);

  const myPayingAccount = balance.accounts[0];

  const { accountByMint } = useUserAccounts();

  const {
    bidsToClaim,
    totalWinnerPayments,
    payoutTickets,
    participationPossibleTotal,
    participationUnredeemedTotal,
    hasParticipation,
  } = useBillingInfo({
    auctionView,
  });
  const totalUnsettled = fromLamports(
    bidsToClaim.reduce(
      (acc, el) => (acc += el.metadata.info.lastBid.toNumber()),
      0,
    ),
    mint,
  );

  const isLoading = totalUnsettled === 0 && bidsToClaim.length === 0;
  async function actionSettle() {
    {
      setConfirmTrigger(true);
      try {
        // pull missing data and complete the auction view to settle.
        const {
          auctionDataExtended,
          auctionManagersByAuction,
          safetyDepositBoxesByVaultAndIndex,
          metadataByMint,
          bidderMetadataByAuctionAndBidder:
            updatedBidderMetadataByAuctionAndBidder,
          bidderPotsByAuctionAndBidder,
          bidRedemptionV2sByAuctionManagerAndWinningIndex,
          masterEditions,
          vaults,
          safetyDepositConfigsByAuctionManagerAndIndex,
          masterEditionsByPrintingMint,
          masterEditionsByOneTimeAuthMint,
          metadataByMasterEdition,
          metadataByAuction,
        } = await pullAuctionPage(auctionView.auction.pubkey);
        const completeAuctionView = processAccountsIntoAuctionView(
          auctionView.auction.pubkey,
          auctionView.auction,
          auctionDataExtended,
          auctionManagersByAuction,
          safetyDepositBoxesByVaultAndIndex,
          metadataByMint,
          updatedBidderMetadataByAuctionAndBidder,
          bidderPotsByAuctionAndBidder,
          bidRedemptionV2sByAuctionManagerAndWinningIndex,
          masterEditions,
          vaults,
          safetyDepositConfigsByAuctionManagerAndIndex,
          masterEditionsByPrintingMint,
          masterEditionsByOneTimeAuthMint,
          metadataByMasterEdition,
          {},
          metadataByAuction,
          undefined,
        );
        if (completeAuctionView) {
          await settle(
            connection,
            wallet,
            completeAuctionView,
            // Just claim all bidder pots
            bidsToClaim.map(b => b.pot),
            myPayingAccount?.pubkey,
            accountByMint,
          );
          // accept funds (open WSOL & close WSOL) only if Auction currency SOL
          if (
            wallet.publicKey &&
            auctionView.auction.info.tokenMint == WRAPPED_SOL_MINT.toBase58()
          ) {
            const ata = await getPersonalEscrowAta(wallet);
            if (ata) await closePersonalEscrow(connection, wallet, ata);
          }
          supabaseUpdateIsRedeemAuctionStatus(auctionView?.auction.pubkey);
        }
      } catch (e) {
        console.log('🚀 ~ file: billing.tsx ~ line 516 ~ actionSettle ~ e', e);
        setConfirmTrigger(false);
        return false;
      }
      setEscrowBalanceRefreshCounter(ctr => ctr + 1);
      await pullBillingPage(id);
      setConfirmTrigger(false);
    }
  }
  return (
    <Row className={Container} ref={ref}>
      {/* Art Column */}
      <Col className={ColumnBox} span={24} md={13}>
        <div className={ArtContainer}>
          {data && (
            <Image
              src={data.image}
              wrapperClassName={ArtContentStyle}
              loading="lazy"
              placeholder={<ThreeDots />}
            />
          )}

          {!data && <ThreeDots />}
        </div>
      </Col>

      {/* Art Details and Bid Details Column */}
      <Col className={ColumnBox} span={24} md={7}>
        <div className={ArtDetailsColumn}>
          <div className={`${OverflowYAuto} ${PaddingBox} `}>
            <div className={ArtTitle}>{art.title}</div>

            <div className={TotalAuctionGroupValue}>
              <div className={TotalAuctionLabel}>TOTAL AUCTION VALUE</div>
              <div className={TotalAuctionValue}>
                {fromLamports(
                  totalWinnerPayments + participationPossibleTotal,
                  mint,
                )}{' '}
                SOL
              </div>
            </div>

            <div className={GroupValue}>
              <div className={BillingLabel}>
                TOTAL COLLECTED BY ARTISTS AND AUCTIONEER
              </div>
              <div className={BillingValue}>
                {fromLamports(
                  Object.values(payoutTickets).reduce(
                    (acc, el) => (acc += el.sum),
                    0,
                  ),
                  mint,
                )}{' '}
                SOL
              </div>
            </div>

            <div className={GroupValue}>
              <div className={BillingLabel}>TOTAL UNSETTLED</div>
              <div className={BillingValue}>{totalUnsettled} SOL</div>
            </div>

            <div className={GroupValue}>
              <div className={BillingLabel}>TOTAL IN ESCROW</div>
              <div className={BillingValue}>
                {escrowBalance !== undefined ? (
                  `${escrowBalance} SOL`
                ) : (
                  <Spin />
                )}
              </div>
            </div>

            {hasParticipation && (
              <div className={GroupValue}>
                <div className={BillingLabel}>
                  TOTAL UNREDEEMED PARTICIPATION FEES OUTSTANDING
                </div>
                <div className={BillingValue}>
                  {fromLamports(participationUnredeemedTotal, mint)} SOL
                </div>
              </div>
            )}
          </div>

          <div className={StatusContainer}>
            <div className={PaddingBox}>
              <div className={uFlex}>
                <Avatar size={40} style={{ marginRight: 16 }} />

                <div>
                  <div className={StatusBillingLabel}>
                    total auction redeemed value
                  </div>

                  <div className={BillingValue} style={{ fontSize: 18 }}>
                    {fromLamports(
                      totalWinnerPayments +
                        participationPossibleTotal -
                        participationUnredeemedTotal,
                      mint,
                    )}{' '}
                    SOL
                  </div>
                </div>
              </div>

              <div style={{ paddingRight: 8, marginTop: 32 }}>
                {confirmTrigger ||
                  isLoading ||
                  (Object.keys(payoutTickets).length > 0 && (
                    <ActionButton width="100%" disabled>
                      <Spin className={SpinnerStyle} />
                      please wait...
                    </ActionButton>
                  ))}
                {!confirmTrigger && Object.keys(payoutTickets).length > 0 && (
                  <ActionButton width="100%" disabled>
                    {' '}
                    settled
                  </ActionButton>
                )}
                {!confirmTrigger &&
                  !isLoading &&
                  Object.keys(payoutTickets).length === 0 && (
                    <ActionButton width="100%" onClick={actionSettle}>
                      settle outstanding
                    </ActionButton>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Col>

      {/* Bids History Column */}
      <Col className={`${ColumnBox} ${PaddingBox}`} span={24} md={4}>
        <BillingHistory
          auction={auctionView}
          bids={Object.keys(payoutTickets).map(t => ({
            key: t,
            address: t,
            amount: payoutTickets[t].sum,
          }))}
        />
      </Col>
    </Row>
  );
};
