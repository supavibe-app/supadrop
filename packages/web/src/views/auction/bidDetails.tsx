import React, { useCallback, useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { BidStatus, ButtonWrapper, CurrentBid, NormalFont, WhiteColor } from './style';
import { BidderMetadata, CountdownState, formatTokenAmount, ParsedAccount, shortenAddress, useNativeAccount, useWalletModal, formatNumber, PriceFloorType, useMint, fromLamports } from '@oyster/common';
import moment from 'moment';

import ActionButton from '../../components/ActionButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { Art } from '../../types';
import { TwitterOutlined } from '@ant-design/icons';
import { AuctionView, useHighestBidForAuction } from '../../hooks';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const BidDetails = ({ art, auction, highestBid, bids, setShowPlaceBid, showPlaceBid, currentBidAmount }: {
  art: Art;
  auction: AuctionView | undefined;
  highestBid: ParsedAccount<BidderMetadata> | undefined;
  bids: ParsedAccount<BidderMetadata>[];
  showPlaceBid: boolean;
  setShowPlaceBid: (visible: boolean) => void;
  currentBidAmount: number;
}) => {
  const { wallet, connect, connected, publicKey } = useWallet();
  const { account } = useNativeAccount();
  const { setVisible } = useWalletModal();
  const owner = auction?.auction.account.owner.toString();
  const [state, setState] = useState<CountdownState>();
  const ended = state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

  const open = useCallback(() => setVisible(true), [setVisible]);

  const bid = useHighestBidForAuction(auction?.auction.pubkey || '');

  const mintInfo = useMint(auction?.auction.info.tokenMint);
  const priceFloor =
    auction?.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auction?.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;

  const balance = parseFloat(formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL));
  const currentBid = parseFloat(formatTokenAmount(bid?.info.lastBid)) || fromLamports(priceFloor, mintInfo);
  const minimumBid = currentBid + currentBid * 0.1;

  // console.log('auctionView', auction);
  // console.log('auctionView', auction?.auction.info);

  useEffect(() => {
    if (!connected && showPlaceBid) setShowPlaceBid(false);
    // if (connected) setShowPlaceBid(true);
  }, [connected]);

  // countdown
  useEffect(() => {
    const calc = () => setState(auction?.auction.info.timeToEnd());

    const interval = setInterval(() => calc(), 1000);
    calc();
    return () => clearInterval(interval);
  }, [auction, setState]);

  const handleConnect = useCallback(
    () => {
      if (wallet) connect();
      else open();
    }, [wallet, connect, open],
  );

  const bidDetailsContent = () => {
    if (ended) {
      return (
        <div className={BidStatus}>
          <div>
            <Avatar size={40} />
          </div>

          <div>
            <div>
              winning bid by{' '}
              <span className={WhiteColor}>{highestBid && shortenAddress(highestBid.info.bidderPubkey)}</span>
            </div>

            <div className={CurrentBid}>
              <span className={WhiteColor}>{highestBid && `${formatTokenAmount(highestBid.info.lastBid)} SOL`}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={BidStatus}>
        {art.title && (
          <>
            <div>
              <Avatar size={40} />
            </div>

            <div>
              <div>
                current bid by{' '}
                <span className={WhiteColor}>{highestBid && shortenAddress(highestBid.info.bidderPubkey)}</span>
                <span className={NormalFont}>・{highestBid && moment.unix(highestBid.info.lastBidTimestamp.toNumber()).fromNow()}</span>
              </div>

              <div className={CurrentBid}>
                <span className={WhiteColor}>{highestBid && formatTokenAmount(highestBid.info.lastBid)} SOL</span>

                {' '}ending in{' '}

                {state && (
                  <span className={WhiteColor}>
                    {state.hours} :{' '}
                    {state.minutes > 0 ? state.minutes : `0${state.minutes}`} :{' '}
                    {state.minutes > 0 ? state.minutes : `0${state.minutes}`}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // case 0: loading
  if (!art.title) {
    return (
      <div className={ButtonWrapper}>
        <ActionButton disabled width="100%">please wait...</ActionButton>
      </div>
    );
  }

  // if auction ended
  if (!ended) {
    // case 1: you win the bid
    if (publicKey?.toBase58() === highestBid?.info.bidderPubkey) {
      return (
        <>
          {bidDetailsContent()}
          <div className={ButtonWrapper}>
            <ActionButton width="100%">claim your NFT</ActionButton>
          </div>
        </>
      )
    }

    const isParticipated = bids.filter(bid => bid.info.bidderPubkey === publicKey?.toBase58()).length > 0;

    // case 2: auction ended but not winning 
    if (isParticipated) {
      return (
        <>
          {bidDetailsContent()}
          <div className={ButtonWrapper}>
            <ActionButton width="100%">refund bid</ActionButton>
          </div>
        </>
      )
    }

    // case 3: auction ended but not participated
    return (
      <>
        {bidDetailsContent()}
        <div className={ButtonWrapper}>
          <ActionButton disabled width="100%">ended auction</ActionButton>
        </div>
      </>
    );
  }

  // case 4: your nft on sale
  if (publicKey?.toBase58() === owner) {
    <>
      {bidDetailsContent()}
      <div className={ButtonWrapper}>
        <ActionButton width="100%">
          <TwitterOutlined style={{ color: 'white', marginRight: 8 }} />
          share on twitter
        </ActionButton>
      </div>
    </>
  }

  // place bid page active
  if (showPlaceBid) {
    // case 5: insufficient balance
    if (balance < minimumBid) {
      return (
        <>
          {bidDetailsContent()}
          <div className={ButtonWrapper}>
            <ActionButton width="100%" disabled>
              insufficient balance
            </ActionButton>
          </div>
        </>
      )
    }

    if (currentBidAmount > 0) {
      // case 6: filled amount but not more than minimum bid
      if (currentBidAmount < minimumBid) {
        return (
          <>
            {bidDetailsContent()}
            <div className={ButtonWrapper}>
              <ActionButton width="100%" disabled>
                insufficient balance
              </ActionButton>
            </div>
          </>
        )
      }

      // case 7: filled amount
      return (
        <>
          {bidDetailsContent()}
          <div className={ButtonWrapper}>
            <ActionButton
              width="100%"
            >
              CONFIRM
            </ActionButton>
          </div>
        </>
      );
    }

    // case 8: default view - place bid
    return (
      <>
        {bidDetailsContent()}
        <div className={ButtonWrapper}>
          <ActionButton width="100%" disabled>
            enter your bid amount
          </ActionButton>
        </div>
      </>
    );
  }

  // default case
  return (
    <>
      {bidDetailsContent()}
      <div className={ButtonWrapper}>
        <ActionButton
          width="100%"
          onClick={() => {
            if (!connected) handleConnect();
            else setShowPlaceBid(true);
          }}
        >
          place a bid
        </ActionButton>
      </div>
    </>
  );
};

export default BidDetails;
