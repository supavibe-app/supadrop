import React, { useCallback, useEffect, useState } from 'react';
import { BidderMetadata, CountdownState, formatTokenAmount, ParsedAccount, shortenAddress, useNativeAccount, useWalletModal, formatNumber, PriceFloorType, useMint, useConnection, useUserAccounts, fromLamports, useMeta, AuctionState, VaultState, BidStateType } from '@oyster/common';
import { Avatar, Col, Row, Skeleton, Spin, message } from 'antd';
import { BidStatus, BidStatusEmpty, ButtonWrapper, CurrentBid, NormalFont, PaddingBox, SmallPaddingBox, SpinnerStyle } from './style';
import { TwitterOutlined } from '@ant-design/icons';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import moment from 'moment';

import { getMinimumBid } from './placeBid';
import ActionButton from '../../components/ActionButton';
import { Art } from '../../types';
import { AuctionView, useHighestBidForAuction, useUserArts, useUserBalance } from '../../hooks';
import { sendPlaceBid } from '../../actions/sendPlaceBid';
import { eligibleForParticipationPrizeGivenWinningIndex, sendRedeemBid } from '../../actions/sendRedeemBid';
import { uFontSize24, uTextAlignEnd, WhiteColor } from '../../styles';

const BidDetails = ({ art, auction, highestBid, bids, setShowPlaceBid, showPlaceBid, currentBidAmount }: {
  art: Art;
  auction: AuctionView | undefined;
  highestBid: ParsedAccount<BidderMetadata> | undefined;
  bids: ParsedAccount<BidderMetadata>[];
  showPlaceBid: boolean;
  setShowPlaceBid: (visible: boolean) => void;
  currentBidAmount: number | undefined;
}) => {
  const connection = useConnection();
  const { setVisible } = useWalletModal();
  const { account } = useNativeAccount();
  const { accountByMint } = useUserAccounts();
  const { update, prizeTrackingTickets, bidRedemptions } = useMeta();
  const ownedMetadata = useUserArts();

  const walletContext = useWallet();
  const { wallet, connect, connected, publicKey } = walletContext;

  const owner = auction?.auctionManager.authority.toString();

  const [confirmTrigger, setConfirmTrigger] = useState(false);
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
  const minimumBid = getMinimumBid(currentBid);
  const myPayingAccount = useUserBalance(auction?.auction.info.tokenMint).accounts[0]

  let winnerIndex: number | null = null;
  if (auction?.myBidderPot?.pubkey)
    winnerIndex = auction?.auction.info.bidState.getWinnerIndex(
      auction?.myBidderPot?.info.bidderAct,
    );
  const eligibleForOpenEdition = eligibleForParticipationPrizeGivenWinningIndex(
    winnerIndex,
    auction,
    auction?.myBidderMetadata,
    auction?.myBidRedemption,
  );

  const eligibleForAnything = winnerIndex !== null || eligibleForOpenEdition;

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

  const baseInstantSalePrice =
    auction?.auctionDataExtended?.info.instantSalePrice;

  const instantSalePrice = (baseInstantSalePrice?.toNumber() || minimumBid) / Math.pow(10, 9);
  const isParticipated = bids.filter(bid => bid.info.bidderPubkey === publicKey?.toBase58()).length > 0;

  const BidDetailsContent = ({ children }) => {
    const isAuctionNotStarted =
      auction?.auction.info.state === AuctionState.Created;

    const isOpenEditionSale =
      auction?.auction.info.bidState.type === BidStateType.OpenEdition;
    const doesInstantSaleHasNoItems =
      Number(auction?.myBidderPot?.info.emptied) !== 0 &&
      auction?.auction.info.bidState.max.toNumber() === bids.length;

    const shouldHideInstantSale =
      !isOpenEditionSale &&
      auction?.isInstantSale &&
      !owner &&
      doesInstantSaleHasNoItems;

    const shouldHide =
      shouldHideInstantSale ||
      auction?.vault.info.state === VaultState.Deactivated;

    if (shouldHideInstantSale && isAuctionNotStarted) {
      return (<BidDetailsContent>
        <div className={ButtonWrapper}>
          <ActionButton disabled width="100%">ended auction</ActionButton>
        </div>
      </BidDetailsContent>
      )
    }
    if (shouldHide) {
      if (eligibleForAnything) {
        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton width="100%">LISTING</ActionButton>
            </div>
          </BidDetailsContent>
        )
      }
      return <></>;
    }

    if (ended && !auction?.isInstantSale) {
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

              <Col className={uTextAlignEnd} span={12}>
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
                {!auction?.isInstantSale && <div>
                  current bid by{' '}
                  <span className={WhiteColor}>{shortenAddress(highestBid.info.bidderPubkey)}</span>
                  <span className={NormalFont}>・{moment.unix(highestBid.info.lastBidTimestamp.toNumber()).fromNow()}</span>
                </div>
                }

                <div className={CurrentBid}>
                  <span className={WhiteColor}>{formatTokenAmount(highestBid.info.lastBid)} SOL</span>
                  {' '}ending in{' '}
                  {!auction?.isInstantSale && state && (
                    <span className={WhiteColor}>
                      {state.hours} :{' '}
                      {state.minutes > 9 ? state.minutes : `0${state.minutes}`} :{' '}
                      {state.seconds > 9 ? state.seconds : `0${state.seconds}`}
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

              <Col className={uTextAlignEnd} span={12}>
                {!auction?.isInstantSale && <div>ending in</div>}
                {!auction?.isInstantSale && state && (
                  <div className={`${WhiteColor} ${uFontSize24}`}>
                    {state.hours} :{' '}
                    {state.minutes > 9 ? state.minutes : `0${state.minutes}`} :{' '}
                    {state.seconds > 9 ? state.seconds : `0${state.seconds}`}
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

  const instantSale = async () => {
    try {
      await sendPlaceBid(
        connection,
        walletContext,
        publicKey?.toBase58(),
        auction!!,
        accountByMint,
        instantSalePrice,
      );
    } catch (e) {
      console.error('sendPlaceBid', e);
      return
    }

    const newAuctionState = await update(
      auction?.auction.pubkey,
      publicKey,
    );
    auction!!.auction = newAuctionState[0];
    auction!!.myBidderPot = newAuctionState[1];
    auction!!.myBidderMetadata = newAuctionState[2];
    // Claim the purchase
    try {
      await sendRedeemBid(
        connection,
        walletContext,
        myPayingAccount.pubkey,
        auction!!,
        accountByMint,
        prizeTrackingTickets,
        bidRedemptions,
        bids,
      ).then(async () => {
        await update();
        // setShowBidModal(false);
        // setShowRedeemedBidModal(true);
      });
    } catch (e) {
      console.error(e);
    }

    // setLoading(false);
  }

  if (confirmTrigger) {
    return (
      <BidDetailsContent>
        <div className={ButtonWrapper}>
          <ActionButton width="100%" disabled>
            <Spin className={SpinnerStyle} />confirm your wallet
          </ActionButton>
        </div>
      </BidDetailsContent>
    );
  }

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
    if (!auction?.isInstantSale) {
      // case 1: you win the bid
      if (highestBid && publicKey && publicKey?.toBase58() === highestBid?.info.bidderPubkey) {
        const filterMetadata = ownedMetadata.filter(metadata => metadata.metadata.info.mint === art.mint);

        // if NFT claimed
        if (filterMetadata.length > 0) {
          return (
            <BidDetailsContent>
              <div className={ButtonWrapper}>
                <ActionButton to="/create/0" width="100%">LIST NFT</ActionButton>
              </div>
            </BidDetailsContent>
          );
        }

        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton width="100%">claim NFT</ActionButton>
            </div>
          </BidDetailsContent>
        );
      }

      // case 2: auction ended but not winning 
      if (isParticipated) {
        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton width="100%">refund bid</ActionButton>
            </div>
          </BidDetailsContent>
        );
      }

      // case 3: auction ended but not participated
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton disabled width="100%">ended auction</ActionButton>
          </div>
        </BidDetailsContent>
      );
    } else {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton disabled width="100%">not for sale</ActionButton>
          </div>
        </BidDetailsContent>
      );
    }
  }

  // case 4: your nft on sale
  if (publicKey?.toBase58() === owner) {
    const baseURL = process.env.REACT_APP_SUPABASE_URL || 'https://supadrop.com';
    const auctionURL = `${baseURL}/auction/${auction?.auction.pubkey}`;
    const twitterText = `gm%21%E2%80%A8i%20just%20list%20my%20NFT%20on%20supadrop%20marketplace%2C%20check%20this%20out%21%E2%80%A8%20${auctionURL}`;
    const twitterIntent = `https://twitter.com/intent/tweet?text=${twitterText}`;

    if (auction?.isInstantSale && !eligibleForAnything) {
      return (
        <BidDetailsContent>
          <a className={ButtonWrapper}>
            <ActionButton width="100%" onClick={() =>
              auction?.isInstantSale && instantSale()
            }>
              UNLIST
            </ActionButton>
          </a>
        </BidDetailsContent>
      );
    }

    if (!ended) {
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
  }

  // case : instant sale
  if (auction?.isInstantSale && !(publicKey?.toBase58() === owner && !eligibleForAnything)) {
    if (!auction.myBidderPot && balance > instantSalePrice) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton width="100%" onClick={instantSale}>
              BUY NOW
            </ActionButton>
          </div>
        </BidDetailsContent>
      );
    }

    // !auction.myBidderPot && balance < instantSalePrice

    return (
      <BidDetailsContent>
        <div className={ButtonWrapper}>
          <ActionButton width="100%" onClick={() => message.error('not enough SOL')}>
            BUY NOW
          </ActionButton>
        </div>
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

    if (currentBidAmount && currentBidAmount > 0) {
      // case 6: filled amount but not more than minimum bid
      if (currentBidAmount < minimumBid) {
        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton width="100%" disabled>bid at least {minimumBid} SOL</ActionButton>
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
              onClick={async () => {
                setConfirmTrigger(true);
                await sendPlaceBid(
                  connection,
                  walletContext,
                  publicKey?.toBase58(),
                  auction!!,
                  accountByMint,
                  currentBidAmount,
                ).then(() => {
                  // user click approve
                  setShowPlaceBid(false);
                  setConfirmTrigger(false);
                }).catch(() => {
                  // user click cacel
                  setConfirmTrigger(false);
                });
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

  // case : instant sale end
  if (auction?.isInstantSale && ended && eligibleForAnything) {
    return (
      <></>
    )
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
          }}>
          {isParticipated ? 'bid again' : 'place a bid'}
        </ActionButton>
      </div>
    </BidDetailsContent>
  );
};

export default BidDetails;
function useAuctionExtended(auction: AuctionView | undefined) {
  throw new Error('Function not implemented.');
}

