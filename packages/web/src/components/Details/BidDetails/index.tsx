import React, { useCallback, useEffect, useState } from 'react';
import {
  BidderMetadata,
  CountdownState,
  formatTokenAmount,
  ParsedAccount,
  shortenAddress,
  useNativeAccount,
  useWalletModal,
  formatNumber,
  PriceFloorType,
  useMint,
  useConnection,
  useUserAccounts,
  fromLamports,
  useMeta,
  AuctionState,
  VaultState,
  BidStateType,
  ItemAuction,
  WinningConfigType,
  supabase,
  supabaseUpdateBid,
  supabaseUpdateStatusInstantSale,
  supabaseUpdateIsRedeem,
  supabaseUpdateIsRedeemAuctionStatus,
} from '@oyster/common';
import { Avatar, Col, Row, Skeleton, Spin, message } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import moment from 'moment';

import getMinimumBid from '../../../helpers/getMinimumBid';
import ActionButton from '../../../components/ActionButton';
import { Art } from '../../../types';
import {
  AuctionView,
  useHighestBidForAuction,
  useUserArts,
  useUserBalance,
} from '../../../hooks';
import { sendPlaceBid } from '../../../actions/sendPlaceBid';
import {
  eligibleForParticipationPrizeGivenWinningIndex,
  sendRedeemBid,
} from '../../../actions/sendRedeemBid';
import { uFontSize24, uTextAlignEnd, WhiteColor } from '../../../styles';
import {
  BidStatus,
  BidStatusEmpty,
  ButtonWrapper,
  CurrentBid,
  NormalFont,
  PaddingBox,
  SmallPaddingBox,
  SpinnerStyle,
} from './style';
import countDown from '../../../helpers/countdown';
import { endSale } from '../../AuctionCard/utils/endSale';
import { useInstantSaleState } from '../../AuctionCard/hooks/useInstantSaleState';
import { sendCancelBid } from '../../../actions/cancelBid';
import { Link } from 'react-router-dom';
import isEnded from '../../Home/helpers/isEnded';
import Congratulations from '../../Congratulations';

const BidDetails = ({
  art,
  auctionDatabase,
  auction,
  highestBid,
  bids,
  setShowPlaceBid,
  showPlaceBid,
  currentBidAmount,
  users,
}: {
  art: Art;
  auction?: AuctionView;
  auctionDatabase?: ItemAuction;
  highestBid?: ParsedAccount<BidderMetadata>;
  bids: ParsedAccount<BidderMetadata>[];
  showPlaceBid: boolean;
  setShowPlaceBid: (visible: boolean) => void;
  currentBidAmount: number | undefined;
  users: any;
}) => {
  const connection = useConnection();
  const { setVisible } = useWalletModal();
  const { account } = useNativeAccount();
  const { accountByMint } = useUserAccounts();
  const {
    update,
    prizeTrackingTickets,
    bidRedemptions,
    pullAuctionPage,
    setBidPlaced,
    updateDetailAuction,
  } = useMeta();
  const ownedMetadata = useUserArts();

  const walletContext = useWallet();
  const { wallet, connect, connected, publicKey } = walletContext;

  const owner = auctionDatabase?.owner;
  const endAt = auctionDatabase?.endAt;
  const [auctionID, setAuctionID] = useState('');
  useEffect(() => {
    if (
      auction?.auction.info.auctionGap &&
      highestBid?.info.lastBidTimestamp.toNumber() &&
      endAt &&
      auctionDatabase?.id
    ) {
      let latestTime =
        auction?.auction.info.auctionGap?.toNumber() +
        highestBid?.info.lastBidTimestamp.toNumber();
      if (latestTime > endAt) {
        supabase
          .from('auction_status')
          .update({
            end_auction: latestTime,
          })
          .eq('id', auctionDatabase.id)
          .then(data => {
            updateDetailAuction(auctionDatabase.id);
          });
      }
    }
  }, [highestBid]);

  const [confirmTrigger, setConfirmTrigger] = useState(false);
  const [state, setState] = useState<CountdownState>();

  const isAuctionManagerAuthorityNotWalletOwner =
    auction?.auctionManager.authority !== publicKey?.toBase58();

  const open = useCallback(() => setVisible(true), [setVisible]);

  const bid = useHighestBidForAuction(auctionDatabase?.id || '');
  const priceFloor = auctionDatabase?.price_floor;
  const balance = parseFloat(
    formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL),
  );
  const [currentBid, setCurrentBid] = useState(
    bid ? parseFloat(formatTokenAmount(bid?.info.lastBid)) : priceFloor,
  );

  const [minimumBid, setMinimumBid] = useState(
    bid ? getMinimumBid(currentBid) : priceFloor,
  );
  const myPayingAccount = useUserBalance(auctionDatabase?.token_mint)
    .accounts[0];

  let winnerIndex: number | null = null;
  if (auction?.myBidderPot?.pubkey)
    winnerIndex = auction?.auction.info.bidState.getWinnerIndex(
      auction?.myBidderPot?.info.bidderAct,
    );
  const [eligibleForOpenEdition, setEligibleForOpenEdition] = useState(
    eligibleForParticipationPrizeGivenWinningIndex(
      winnerIndex,
      auction,
      auction?.myBidderMetadata,
      auction?.myBidRedemption,
    ),
  );

  const [eligibleForAnything, setEligibleForAnything] = useState(
    winnerIndex !== null || eligibleForOpenEdition,
  );

  useEffect(() => {
    if (!connected && showPlaceBid) setShowPlaceBid(false);
    // if (connected) setShowPlaceBid(true);
  }, [connected]);

  useEffect(() => {
    if (auction?.myBidderPot?.pubkey)
      winnerIndex = auction?.auction.info.bidState.getWinnerIndex(
        auction?.myBidderPot?.info.bidderAct,
      );

    setEligibleForAnything(winnerIndex !== null || eligibleForOpenEdition);
    setCurrentBid(
      bid ? parseFloat(formatTokenAmount(bid?.info.lastBid)) : priceFloor,
    );
    setMinimumBid(bid ? getMinimumBid(currentBid) : priceFloor);
  }, [auctionDatabase, bid, auction]);

  // countdown
  useEffect(() => {
    if (endAt) {
      const calc = () => setState(countDown(endAt));
      const interval = setInterval(() => calc(), 1000);
      calc();
      return () => clearInterval(interval);
    }
  }, [endAt]);

  const handleConnect = useCallback(() => {
    if (wallet) connect();
    else open();
  }, [wallet, connect, open]);

  const baseInstantSalePrice = auctionDatabase?.price_floor;

  const instantSalePrice =
    (baseInstantSalePrice || minimumBid) / Math.pow(10, 9);
  const isParticipated =
    bids.filter(bid => bid.info.bidderPubkey === publicKey?.toBase58()).length >
    0;
  const actionEndedAuction = async () => {
    setConfirmTrigger(true);
    try {
      if (eligibleForAnything) {
        const wallet = walletContext;
        const auctionView = auction!!;
        await sendRedeemBid(
          connection,
          wallet,
          myPayingAccount.pubkey,
          auctionView,
          accountByMint,
          prizeTrackingTickets,
          bidRedemptions,
          bids,
        ).then(data => {
          if (auction?.auctionManager.authority === publicKey?.toBase58()) {
            supabaseUpdateIsRedeemAuctionStatus(auction?.auction.pubkey);
          } else {
            supabaseUpdateIsRedeem(
              auctionView.auction.pubkey,
              publicKey?.toBase58(),
            );
          }
        });
      } else {
        const wallet = walletContext;
        const auctionView = auction!!;
        await sendCancelBid(
          connection,
          wallet,
          myPayingAccount.pubkey,
          auctionView,
          accountByMint,
          bids,
          bidRedemptions,
          prizeTrackingTickets,
        ).then(data => {
          if (auction?.auctionManager.authority === publicKey?.toBase58()) {
            supabaseUpdateIsRedeemAuctionStatus(auction?.auction.pubkey);
          } else {
            supabaseUpdateIsRedeem(
              auctionView.auction.pubkey,
              publicKey?.toBase58(),
            );
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
    setConfirmTrigger(false);
  };

  const endInstantSale = async () => {
    setConfirmTrigger(true);
    try {
      const auctionView = auction!!;
      const wallet = walletContext;
      await endSale({
        auctionView,
        connection,
        accountByMint,
        bids,
        bidRedemptions,
        prizeTrackingTickets,
        wallet,
      }).then(data => { });
      supabaseUpdateStatusInstantSale(auction?.auction.pubkey);
      supabaseUpdateIsRedeem(auctionView.auction.pubkey, publicKey?.toBase58());
      setConfirmTrigger(false);
    } catch (e) {
      setConfirmTrigger(false);
      console.error('endAuction', e);
      return;
    }
  };

  const instantSale = async () => {
    setConfirmTrigger(true);
    const instantSalePrice =
      auction?.auctionDataExtended?.info.instantSalePrice;
    const winningConfigType =
      auction?.participationItem?.winningConfigType ||
      auction?.items[0][0].winningConfigType;
    const isAuctionItemMaster = [
      WinningConfigType.FullRightsTransfer,
      WinningConfigType.TokenOnlyTransfer,
    ].includes(winningConfigType!!);
    const allowBidToPublic =
      myPayingAccount &&
      !auction?.myBidderPot &&
      isAuctionManagerAuthorityNotWalletOwner;
    const allowBidToAuctionOwner =
      myPayingAccount &&
      !isAuctionManagerAuthorityNotWalletOwner &&
      isAuctionItemMaster;

    // Placing a "bid" of the full amount results in a purchase to redeem.
    if (instantSalePrice && (allowBidToPublic || allowBidToAuctionOwner)) {
      try {
        const wallet = walletContext;
        const auctionView = auction!!;
        await sendPlaceBid(
          connection,
          wallet,
          myPayingAccount.pubkey,
          auctionView,
          accountByMint,
          instantSalePrice,
        );
        pullAuctionPage(auction?.auction.pubkey || '');
        supabaseUpdateBid(
          auction?.auction.pubkey,
          wallet.publicKey?.toBase58(),
          instantSalePrice.toNumber(),
        );
        supabaseUpdateStatusInstantSale(auction?.auction.pubkey);
        console.log('idnft', auctionView.auction.pubkey)
        setAuctionID(auctionView.auction.pubkey);
      } catch (e) {
        console.error('sendPlaceBid', e);
        setConfirmTrigger(false);
        return;
      }
    }

    const newAuctionState = await update(auction?.auction.pubkey, publicKey);
    if (auction) {
      auction.auction = newAuctionState[0];
      auction.myBidderPot = newAuctionState[1];
      auction.myBidderMetadata = newAuctionState[2];
    }
    // Claim the purchase
    try {
      const wallet = walletContext;
      const auctionView = auction!!;
      await sendRedeemBid(
        connection,
        wallet,
        myPayingAccount.pubkey,
        auctionView,
        accountByMint,
        prizeTrackingTickets,
        bidRedemptions,
        bids,
      ).then(async () => {
        supabaseUpdateIsRedeem(
          auction?.auction.pubkey,
          wallet.publicKey?.toBase58(),
        );
        pullAuctionPage(auction?.auction.pubkey || '');
        await update();
      });
    } catch (e) {
      console.error(e);
    }
    setConfirmTrigger(false);
  };
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

    if (auction?.auction.pubkey) {
      console.log('idAuction', auction?.auction.pubkey)
      return (<Congratulations id={auction?.auction.pubkey} />);
    }
    // if (auctionID) return (<Congratulations id={auctionID} />);

    if (shouldHideInstantSale && isAuctionNotStarted) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton disabled width="100%">
              ended auction
            </ActionButton>
          </div>
        </BidDetailsContent>
      );
    }

    if (shouldHide && !isParticipated) {
      if (eligibleForAnything) {
        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton width="100%">LISTING</ActionButton>
            </div>
          </BidDetailsContent>
        );
      }

      return <></>;
    }
    if (isEnded(state) && !auction?.isInstantSale) {
      return (
        <div className={art.title && highestBid ? PaddingBox : SmallPaddingBox}>
          {art.title && highestBid && (
            <div className={BidStatus}>
              <div>
                <Avatar
                  src={
                    users[bid.info.bidderPubkey]?.img_profile
                      ? users[bid.info.bidderPubkey].img_profile
                      : null
                  }
                  size={40}
                />
              </div>

              <div>
                <div>
                  winning bid by{' '}
                  <span className={WhiteColor}>
                    {users[bid.info.bidderPubkey]?.username
                      ? users[bid.info.bidderPubkey].username
                      : shortenAddress(bid.info.bidderPubkey)}
                  </span>
                </div>

                <div className={CurrentBid}>
                  <span className={WhiteColor}>{currentBid} SOL</span>
                </div>
              </div>
            </div>
          )}

          {art.title && !highestBid && (
            <Row className={BidStatusEmpty}>
              <Col span={12}>
                <div>reserve price</div>
                <div className={`${WhiteColor} ${uFontSize24}`}>
                  {currentBid} SOL
                </div>
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
                <Avatar src={users[highestBid.info.bidderPubkey]} size={40} />
              </div>

              <div>
                {!auction?.isInstantSale && (
                  <div>
                    current bid by{' '}
                    <span className={WhiteColor}>
                      {users[highestBid.info.bidderPubkey]
                        ? users[highestBid.info.bidderPubkey].username
                        : shortenAddress(highestBid.info.bidderPubkey)}
                    </span>
                    <span className={NormalFont}>
                      ・
                      {moment
                        .unix(highestBid.info.lastBidTimestamp.toNumber())
                        .fromNow()}
                    </span>
                  </div>
                )}

                <div className={CurrentBid}>
                  <span className={WhiteColor}>{currentBid} SOL</span> ending in{' '}
                  {!auction?.isInstantSale && state && (
                    <span className={WhiteColor}>
                      {state.hours} :{' '}
                      {state.minutes > 9 ? state.minutes : `0${state.minutes}`}{' '}
                      :{' '}
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
                <div className={`${WhiteColor} ${uFontSize24}`}>
                  {currentBid} SOL
                </div>
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

  if (confirmTrigger) {
    return (
      <BidDetailsContent>
        <div className={ButtonWrapper}>
          <ActionButton width="100%" disabled>
            <Spin className={SpinnerStyle} />
            confirm your wallet
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
          <ActionButton disabled width="100%">
            please wait...
          </ActionButton>
        </div>
      </div>
    );
  }

  // if auction ended
  if (isEnded(state)) {
    if (!auction?.isInstantSale) {
      // case 1: you win the bid

      if (
        highestBid &&
        publicKey &&
        publicKey?.toBase58() === highestBid?.info.bidderPubkey
      ) {
        const filterMetadata = ownedMetadata.filter(
          metadata => metadata.metadata.info.mint === art.mint,
        );

        // if NFT claimed
        if (filterMetadata.length > 0) {
          return (
            <BidDetailsContent>
              <div className={ButtonWrapper}>
                <Link
                  to={{
                    pathname: `/list/create`,
                    state: {
                      idNFT: filterMetadata[0].metadata.pubkey,
                      item: filterMetadata[0],
                    },
                  }}
                >
                  <ActionButton width="100%">LIST NFT</ActionButton>
                </Link>
              </div>
            </BidDetailsContent>
          );
        }

        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton onClick={actionEndedAuction} width="100%">
                claim NFT
              </ActionButton>
            </div>
          </BidDetailsContent>
        );
      }

      // case 2: auction ended but not winning

      if (isParticipated) {
        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton onClick={actionEndedAuction} width="100%">
                refund bid
              </ActionButton>
            </div>
          </BidDetailsContent>
        );
      }
      if (
        auction?.auctionManager.authority === publicKey?.toBase58() &&
        bids.length === 0
      ) {
        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton onClick={actionEndedAuction} width="100%">
                reclaim NFT
              </ActionButton>
            </div>
          </BidDetailsContent>
        );
      }

      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton disabled width="100%">
              ended auction
            </ActionButton>
          </div>
        </BidDetailsContent>
      );
    } else if (!auction.isInstantSale) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton disabled width="100%">
              not for sale
            </ActionButton>
          </div>
        </BidDetailsContent>
      );
    }
  }

  // case 4: your nft on sale
  if (publicKey?.toBase58() === owner) {
    const baseURL =
      process.env.REACT_APP_SUPABASE_URL || 'https://supadrop.com';
    const auctionURL = `${baseURL}/auction/${auctionDatabase?.id}`;
    const twitterText = `gm%21%E2%80%A8i%20just%20list%20my%20NFT%20on%20supadrop%20marketplace%2C%20check%20this%20out%21%E2%80%A8%20${auctionURL}`;
    const twitterIntent = `https://twitter.com/intent/tweet?text=${twitterText}`;

    if (auction?.isInstantSale && !eligibleForAnything) {
      return (
        <BidDetailsContent>
          <a className={ButtonWrapper}>
            <ActionButton width="100%" onClick={endInstantSale}>
              UNLIST
            </ActionButton>
          </a>
        </BidDetailsContent>
      );
    }

    if (!isEnded(state)) {
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
  if (
    auction?.isInstantSale &&
    !(publicKey?.toBase58() === owner && !eligibleForAnything)
  ) {
    if (balance > instantSalePrice) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton width="100%" onClick={instantSale}>
              {!!auction.myBidderPot ? 'CLAIM PURCHASE' : 'BUY NOW'}
            </ActionButton>
          </div>
        </BidDetailsContent>
      );
    }

    // !auction.myBidderPot && balance < instantSalePrice

    return (
      <BidDetailsContent>
        <div className={ButtonWrapper}>
          <ActionButton
            width="100%"
            onClick={() => message.error('not enough SOL')}
          >
            BUY NOW
          </ActionButton>
        </div>
      </BidDetailsContent>
    );
  }

  // place bid page active
  if (showPlaceBid) {
    // case 5: insufficient balance
    if (
      balance < minimumBid ||
      (currentBidAmount && currentBidAmount > balance)
    ) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton width="100%" disabled>
              insufficient balance
            </ActionButton>
          </div>
        </BidDetailsContent>
      );
    }

    if (currentBidAmount && currentBidAmount > 0) {
      // case 6: filled amount but not more than minimum bid
      if (currentBidAmount < minimumBid) {
        return (
          <BidDetailsContent>
            <div className={ButtonWrapper}>
              <ActionButton width="100%" disabled>
                bid at least {minimumBid} SOL
              </ActionButton>
            </div>
          </BidDetailsContent>
        );
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
                )
                  .then(() => {
                    // user click approve
                    setShowPlaceBid(false);
                    setConfirmTrigger(false);
                    pullAuctionPage(auctionDatabase?.id || '');
                    setBidPlaced(true);
                    supabaseUpdateBid(
                      auction?.auction.pubkey,
                      publicKey?.toBase58(),
                      currentBidAmount,
                    );
                  })
                  .catch(() => {
                    // user click cancel
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
  if (auction?.isInstantSale && isEnded(state) && eligibleForAnything) {
    return <></>;
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
