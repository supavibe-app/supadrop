import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Col, Row, Skeleton } from 'antd';
import { BidStatus, BidStatusEmpty, ButtonWrapper, CurrentBid, NormalFont, PaddingBox, SmallPaddingBox } from './style';
import { BidderMetadata, CountdownState, formatTokenAmount, ParsedAccount, shortenAddress, useNativeAccount, useWalletModal, formatNumber, PriceFloorType, useMint, useConnection, useUserAccounts, fromLamports } from '@oyster/common';
import moment from 'moment';

import ActionButton from '../../components/ActionButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { Art } from '../../types';
import { TwitterOutlined } from '@ant-design/icons';
import { AuctionView, useHighestBidForAuction } from '../../hooks';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { uFontSize24, WhiteColor } from '../../styles';
// import { supabase } from '../../../supabaseClient';
import { sendPlaceBid } from '../../actions/sendPlaceBid';
// import BN from 'bn.js';

const BidDetails = ({ art, auction, highestBid, bids, setShowPlaceBid, showPlaceBid, currentBidAmount }: {
  art: Art;
  auction: AuctionView | undefined;
  highestBid: ParsedAccount<BidderMetadata> | undefined;
  bids: ParsedAccount<BidderMetadata>[];
  showPlaceBid: boolean;
  setShowPlaceBid: (visible: boolean) => void;
  currentBidAmount: number;
}) => {
  const connection = useConnection();
  const walletContext = useWallet();
  const { wallet, connect, connected, publicKey } = walletContext;
  const { account } = useNativeAccount();
  const { setVisible } = useWalletModal();
  const { accountByMint } = useUserAccounts();
  const owner = auction?.auctionManager.authority.toString();
  const [state, setState] = useState<CountdownState>();
  const ended = state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

  // const [lastBid, setLastBid] = useState<{ amount: BN } | undefined>(undefined);
  // const [showBidPlaced, setShowBidPlaced] = useState<boolean>(false);

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
    if (!ended) {
      const calc = () => setState(auction?.auction.info.timeToEnd());

      const interval = setInterval(() => calc(), 1000);
      calc();
      return () => clearInterval(interval);
    }
  }, [auction, setState]);

  const handleConnect = useCallback(
    () => {
      if (wallet) connect();
      else open();
    }, [wallet, connect, open],
  );

  const BidDetailsContent = ({ children }) => {
    if (ended) {
      return (
        <div className={art.title && highestBid ? PaddingBox : SmallPaddingBox}>
          {art.title && highestBid && (
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
          )}

          {art.title && !highestBid && (
            <Row className={BidStatusEmpty}>
              <Col span={12}>
                <div>reserve price</div>
                <div className={`${WhiteColor} ${uFontSize24}`}>{currentBid} SOL</div>
              </Col>

              <Col span={12}>
                <div>ending in</div>
                <div className={`${WhiteColor} ${uFontSize24}`}>ended</div>
              </Col>
            </Row>
          )}

          {children}
        </div>
      );
    }

    return (
      <div className={PaddingBox}>
        <div className={BidStatus}>
          {art.title && highestBid && (
            <>
              <div>
                <Avatar size={40} />
              </div>

              <div>
                <div>
                  current bid by{' '}
                  <span className={WhiteColor}>{shortenAddress(highestBid.info.bidderPubkey)}</span>
                  <span className={NormalFont}>・{moment.unix(highestBid.info.lastBidTimestamp.toNumber()).fromNow()}</span>
                </div>

                <div className={CurrentBid}>
                  <span className={WhiteColor}>{formatTokenAmount(highestBid.info.lastBid)} SOL</span>

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

          {art.title && !highestBid && (
            <Row style={{ width: '100%' }}>
              <Col span={12}>
                <div>reserve price</div>
                <div className={`${WhiteColor} ${uFontSize24}`}>{currentBid} SOL</div>
              </Col>

              <Col span={12}>
                <div>ending in</div>
                {state && (
                  <div className={`${WhiteColor} ${uFontSize24}`}>
                    {state.hours} :{' '}
                    {state.minutes > 0 ? state.minutes : `0${state.minutes}`} :{' '}
                    {state.minutes > 0 ? state.minutes : `0${state.minutes}`}
                  </div>
                )}
              </Col>
            </Row>
          )}
        </div>

        {children}
      </div>
    );
  };

  // case 0: loading
  if (!art.title) {
    return (
      <div className={PaddingBox}>
        <div className={BidStatus}>
          <Skeleton avatar paragraph={{ rows: 0 }} />
        </div>
        <div className={ButtonWrapper}>
          <ActionButton disabled width="100%">please wait...</ActionButton>
        </div>
      </div>
    );
  }

  // if auction ended
  if (ended) {
    // case 1: you win the bid
    if (highestBid && publicKey && publicKey?.toBase58() === highestBid?.info.bidderPubkey) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton width="100%">claim your NFT</ActionButton>
          </div>
        </BidDetailsContent>
      )
    }

    const isParticipated = bids.filter(bid => bid.info.bidderPubkey === publicKey?.toBase58()).length > 0;

    // case 2: auction ended but not winning 
    if (isParticipated) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton width="100%">refund bid</ActionButton>
          </div>
        </BidDetailsContent>
      )
    }

    // case 3: auction ended but not participated
    return (
      <BidDetailsContent>
        <div className={ButtonWrapper}>
          <ActionButton disabled width="100%">ended auction</ActionButton>
        </div>
      </BidDetailsContent>
    );
  }

  // case 4: your nft on sale
  if (publicKey?.toBase58() === owner) {
    const baseURL = process.env.REACT_APP_SUPABASE_URL || 'https://supadrop.com';
    const auctionURL = `${baseURL}/auction/${auction?.auction.pubkey}`;
    const twitterText = `gm%21%E2%80%A8i%20just%20list%20my%20NFT%20on%20supadrop%20marketplace%2C%20check%20this%20out%21%E2%80%A8%20${auctionURL}`;
    const twitterIntent = `https://twitter.com/intent/tweet?text=${twitterText}`;

    return (
      <BidDetailsContent>
        <a className={ButtonWrapper} href={twitterIntent}>
          <ActionButton width="100%">
            <TwitterOutlined style={{ color: 'white', marginRight: 8 }} />
            share on twitter
          </ActionButton>
        </a>
      </BidDetailsContent>
    );
  }

  // place bid page active
  if (showPlaceBid) {
    // case 5: insufficient balance
    if (balance < minimumBid) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton width="100%" disabled>
              insufficient balance
            </ActionButton>
          </div>
        </BidDetailsContent>
      )
    }

    if (currentBidAmount > 0) {
      // case 6: filled amount but not more than minimum bid
      if (currentBidAmount < minimumBid) {
        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton width="100%" disabled>
                insufficient bid
              </ActionButton>
            </div>
          </BidDetailsContent>
        )
      }

      // case 7: filled amount
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton
              width="100%"
              onClick={ async () => {
                const bid = await sendPlaceBid(
                    connection,
                    walletContext,
                    publicKey?.toBase58(),
                    auction!!,
                    accountByMint,
                    currentBidAmount,
                  );
                  // setLastBid(bid);
                  // setShowBidPlaced(true);
              }}
            >
              CONFIRM
            </ActionButton>
          </div>
        </BidDetailsContent>
      );
    }

    // case 8: default view - place bid
    return (
      <BidDetailsContent>
        <div className={ButtonWrapper}>
          <ActionButton width="100%" disabled>
            enter your bid amount
          </ActionButton>
        </div>
      </BidDetailsContent>
    );
  }

  // default case
  return (
    <BidDetailsContent>
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
    </BidDetailsContent>
  );
};

export default BidDetails;
