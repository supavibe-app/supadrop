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
  supabaseUpdateNFTHolder,
  supabaseUpdateWinnerAuction,
  Identicon,
} from '@oyster/common';
import { Avatar, Col, Row, Skeleton, Spin, message, Modal } from 'antd';
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
import { Link, useParams } from 'react-router-dom';
import isEnded from '../../Home/helpers/isEnded';
import { getAuctionIsRedeemData } from '../../../database/activityData';
import { ConfirmModal } from '../../ArtCard/style';

const DetailStatus = ({ status, username, time }) => {
  return (
    <div>
      {`${status} `}
      <Link to={`/${username}`}>
        <span className={WhiteColor}>{username}</span>
      </Link>
      <span className={NormalFont}>・{time}</span>
    </div>
  );
};

const BidDetails = ({
  art,
  auctionDatabase,
  auction,
  highestBid,
  bids,
  setShowPlaceBid,
  showPlaceBid,
  currentBidAmount,
  setShowCongratulations,
  loadingDetailAuction,
}: {
  art: Art;
  auction?: AuctionView;
  auctionDatabase?: ItemAuction;
  highestBid?: ParsedAccount<BidderMetadata>;
  bids: ParsedAccount<BidderMetadata>[];
  showPlaceBid: boolean;
  setShowPlaceBid: (visible: boolean) => void;
  currentBidAmount: number | undefined;
  setShowCongratulations: (type: string) => void;
  loadingDetailAuction: boolean;
}) => {
  const connection = useConnection();
  const { setVisible } = useWalletModal();
  const { account } = useNativeAccount();
  const { accountByMint } = useUserAccounts();
  const [counter, setCounter] = useState(0);
  const {
    update,
    prizeTrackingTickets,
    bidRedemptions,
    pullAuctionPage,
    setBidPlaced,
    updateDetailAuction,
    updateNotifAuction,
    updateNotifBidding,
    pullAllSiteData,
    isLoadingMetaplex,
    users,
  } = useMeta();
  const { id } = useParams<{ id: string }>();
  const ownedMetadata = useUserArts();
  const walletContext = useWallet();
  const { wallet, connect, connected, publicKey } = walletContext;
  const {
    data: redeemData,
    loading,
    refetch,
  } = getAuctionIsRedeemData(publicKey?.toBase58(), id);

  const owner = auctionDatabase?.owner;
  const [endAt, setEndAt] = useState(auctionDatabase?.endAt);
  useEffect(() => {
    if (auctionDatabase?.endAt) {
      setEndAt(auctionDatabase.endAt);
    }
  }, [auctionDatabase]);

  const isInstantSale = auction?.auction?.info?.endAuctionAt === undefined;
  const [newBidding, setNewBidding] = useState(false);
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

  const [isRedeem, setIsRedeem] = useState(false);

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

  const [updatedData, setUpdatedData] = useState<any>();
  const getChangeOnSale = () => {
    const mySubscription = supabase
      .from(`auction_status:id=eq.${id}`)
      .on('UPDATE', payload => {
        setUpdatedData('update auction page');
      })
      .subscribe();
    return mySubscription;
  };

  useEffect(() => {
    if (id) {
      const subscriptionOnSale = getChangeOnSale();
      return () => {
        supabase.removeSubscription(subscriptionOnSale);
      };
    }
  }, [id]);
  useEffect(() => {
    if (updatedData && !isInstantSale) {
      pullAuctionPage(id);

      setUpdatedData('');
    }
  }, [updatedData]);

  // countdown
  useEffect(() => {
    if (endAt) {
      const calc = () => setState(countDown(endAt));
      const interval = setInterval(() => calc(), 1000);
      calc();
      return () => clearInterval(interval);
    }
  }, [endAt]);
  useEffect(() => {
    if (
      auction?.auction.info.auctionGap &&
      highestBid?.info.lastBidTimestamp?.toNumber() &&
      endAt &&
      auctionDatabase?.id
    ) {
      let latestTime =
        auction?.auction.info.auctionGap?.toNumber() +
        highestBid?.info.lastBidTimestamp?.toNumber();

      if (latestTime > endAt) {
        if (newBidding || counter === 0) {
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
        setEndAt(latestTime);
      }
    }
    setNewBidding(false);
    setCounter(counter + 1);
  }, [minimumBid]);
  const handleConnect = useCallback(() => {
    if (wallet) connect();
    else open();
  }, [wallet, connect, open]);

  const baseInstantSalePrice = auctionDatabase?.price_floor || minimumBid;
  const isParticipated =
    bids.filter(bid => bid?.info?.bidderPubkey === publicKey?.toBase58())
      .length > 0;
  const actionEndedAuctionClaim = async () => {
    setConfirmTrigger(true);
    if (!eligibleForAnything) {
      const newAuctionState = await update(auction?.auction.pubkey, publicKey);
      if (auction) {
        auction.auction = newAuctionState[0];
        auction.myBidderPot = newAuctionState[1];
        auction.myBidderMetadata = newAuctionState[2];
      }
    }
    try {
      const wallet = walletContext;
      const auctionView = auction!!;

      const redeemBid = await sendRedeemBid(
        connection,
        wallet,
        myPayingAccount.pubkey,
        auctionView,
        accountByMint,
        prizeTrackingTickets,
        bidRedemptions,
        bids,
      );
      localStorage.setItem('reload', 'true');

      if (auction?.auctionManager.authority === publicKey?.toBase58()) {
        await supabaseUpdateIsRedeemAuctionStatus(auction?.auction.pubkey);
        updateNotifAuction(auction?.auction.pubkey || '');
      } else {
        await supabaseUpdateIsRedeem(
          auctionView.auction.pubkey,
          publicKey?.toBase58(),
        );
        updateNotifBidding(
          `${auction?.auction.pubkey}_${publicKey?.toBase58()}`,
        );
        // const filterMetadata = ownedMetadata.filter(
        //   metadata => metadata.metadata.info.mint === art.mint,
        // );
        // console.log(
        //   '🚀 ~ file: index.tsx ~ line 302 ~ actionEndedAuctionClaim ~ filterMetadata',
        //   filterMetadata,
        // );

        setShowCongratulations('claim');
        supabaseUpdateNFTHolder(
          auctionView.thumbnail.metadata.pubkey,
          wallet.publicKey?.toBase58(),
          parseFloat(`${minimumBid}`),
        );
      }
    } catch (e) {
      console.error(e);
    }

    setConfirmTrigger(false);
  };
  const actionEndedAuctionRefund = async () => {
    setConfirmTrigger(true);
    try {
      const wallet = walletContext;
      const auctionView = auction!!;

      const cancelBid = await sendCancelBid(
        connection,
        wallet,
        myPayingAccount.pubkey,
        auctionView,
        accountByMint,
        bids,
        bidRedemptions,
        prizeTrackingTickets,
      );
      if (auction?.auctionManager.authority === publicKey?.toBase58()) {
        await supabaseUpdateIsRedeemAuctionStatus(auction?.auction.pubkey);
        updateNotifAuction(auction?.auction.pubkey || '');
      } else {
        await supabaseUpdateIsRedeem(
          auctionView.auction.pubkey,
          publicKey?.toBase58(),
        );
        updateNotifBidding(
          `${auction?.auction.pubkey}_${publicKey?.toBase58()}`,
        );
      }
      setIsRedeem(true);
    } catch (e) {
      console.error(e);
    }

    setConfirmTrigger(false);
  };
  const actionEndedAuctionReclaim = async () => {
    setConfirmTrigger(true);
    try {
      const wallet = walletContext;
      const auctionView = auction!!;

      const cancelBid = await sendCancelBid(
        connection,
        wallet,
        myPayingAccount.pubkey,
        auctionView,
        accountByMint,
        bids,
        bidRedemptions,
        prizeTrackingTickets,
      );
      localStorage.setItem('reload', 'true');
      if (auction?.auctionManager.authority === publicKey?.toBase58()) {
        await supabaseUpdateIsRedeemAuctionStatus(auction?.auction.pubkey);
        updateNotifAuction(auction?.auction.pubkey || '');
        // const filterMetadata = ownedMetadata.filter(
        //   metadata => metadata.metadata.info.mint === art.mint,
        // );
        // console.log(
        //   '🚀 ~ file: index.tsx ~ line 378 ~ actionEndedAuctionReclaim ~ filterMetadata',
        //   filterMetadata,
        // );
        setShowCongratulations('reclaim');
        supabaseUpdateNFTHolder(
          auctionView.thumbnail.metadata.pubkey,
          wallet.publicKey?.toBase58(),
          parseFloat(`${minimumBid}`),
        );
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
      }).then();
      supabaseUpdateStatusInstantSale(auction?.auction.pubkey);
      supabaseUpdateIsRedeemAuctionStatus(auctionView.auction.pubkey);
      updateNotifBidding(`${auction?.auction.pubkey}_${publicKey?.toBase58()}`);
      setConfirmTrigger(false);
      setShowCongratulations('reclaim');
    } catch (e) {
      setConfirmTrigger(false);
      return;
    }
  };

  const placeBid = async currentBidAmount => {
    try {
      setConfirmTrigger(true);
      await sendPlaceBid(
        connection,
        walletContext,
        publicKey?.toBase58(),
        auction!!,
        accountByMint,
        currentBidAmount,
      );
      // user click approve
      setShowPlaceBid(false);
      setConfirmTrigger(false);
      // pullAuctionPage(auctionDatabase?.id || '');
      setBidPlaced(true);
      supabaseUpdateBid(
        auction?.auction.pubkey,
        publicKey?.toBase58(),
        currentBidAmount,
      );
      setNewBidding(true);
      // user click cancel
    } catch (error) {
      console.error(error);
      setConfirmTrigger(false);
    }
  };

  const instantSale = async () => {
    setConfirmTrigger(true);
    const instantSalePrice =
      auction?.auctionDataExtended?.info.instantSalePrice;
    const winningConfigType =
      auction?.participationItem?.winningConfigType ||
      auction?.items[0][0]?.winningConfigType;
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
          instantSalePrice?.toNumber() / Math.pow(10, 9),
        );
        supabaseUpdateStatusInstantSale(auction?.auction.pubkey);
      } catch (e) {
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
      );
      pullAuctionPage(auction?.auction.pubkey || '');
      await update();
      localStorage.setItem('reload', 'true');
      // const filterMetadata = ownedMetadata.filter(
      //   metadata => metadata.metadata.info.mint === art.mint,
      // );
      // console.log(
      //   '🚀 ~ file: index.tsx ~ line 529 ~ instantSale ~ filterMetadata',
      //   filterMetadata,
      // );

      // const items = auctionView.items;
      // let isAlreadyBought: boolean = false;
      // const isBidCanceled = !!auctionView.myBidderMetadata?.info.cancelled;
      // let canClaimPurchasedItem: boolean = false;
      // if (
      //   auctionView.auction.info.bidState.type == BidStateType.EnglishAuction
      // ) {
      //   console.log('RESULT HERE TRUE', auctionView.auction.info.bidState.type);
      //   for (const item of items) {
      //     for (const subItem of item) {
      //       const bidRedeemed =
      //         auctionView.myBidRedemption?.info.getBidRedeemed(
      //           subItem.safetyDeposit.info.order,
      //         );
      //       console.log('RESULT HERE ITEM', bidRedeemed); // TODO disini masih null
      //       isAlreadyBought = bidRedeemed ? bidRedeemed : false;
      //       if (isAlreadyBought) break;
      //     }
      //   }
      //   canClaimPurchasedItem =
      //     !!(auctionView.myBidderPot && !isBidCanceled) && !isAlreadyBought;
      // } else {
      //   console.log('RESULT HERE ELSE', auctionView.auction.info.bidState.type);
      //   isAlreadyBought = !!(auctionView.myBidderPot && isBidCanceled);
      //   canClaimPurchasedItem = !!(auctionView.myBidderPot && !isBidCanceled);
      // }

      // console.log('RESULT HERE REDEEM 0', isAlreadyBought);
      // console.log('RESULT HERE REDEEM 1', canClaimPurchasedItem);

      // if (isAlreadyBought) {
      setShowCongratulations('claim');
      supabaseUpdateIsRedeem(
        auction?.auction.pubkey,
        wallet.publicKey?.toBase58(),
      );
      updateNotifBidding(`${auction?.auction.pubkey}_${publicKey?.toBase58()}`);
      supabaseUpdateNFTHolder(
        auctionView.thumbnail.metadata.pubkey,
        wallet.publicKey?.toBase58(),
        instantSalePrice?.toNumber()
          ? instantSalePrice?.toNumber() / Math.pow(10, 9)
          : 0,
      );
      supabaseUpdateWinnerAuction(
        auction?.auction.pubkey,
        walletContext.publicKey?.toBase58(),
      );
      // }
    } catch (e) {
      console.error(e);
    }

    setConfirmTrigger(false);
  };
  const unlistConfirmation = e => {
    e.preventDefault();
    Modal.confirm({
      className: ConfirmModal,
      title: 'unlist confirmation',
      content: 'Are you sure delisting your NFT?',
      onOk: endInstantSale,
      okText: 'yes',
      okType: 'text',
      cancelText: 'no',
      cancelButtonProps: { type: 'text' },
      centered: true,
      closable: true,
      icon: null,
    });
  };
  const BidDetailsContent = ({ children }) => {
    const isAuctionNotStarted =
      auction?.auction?.info?.state === AuctionState.Created;

    const isOpenEditionSale =
      auction?.auction?.info?.bidState?.type === BidStateType.OpenEdition;
    const doesInstantSaleHasNoItems =
      Number(auction?.myBidderPot?.info.emptied) !== 0 &&
      auction?.auction?.info?.bidState?.max?.toNumber() === bids.length;

    const shouldHideInstantSale =
      !isOpenEditionSale &&
      isInstantSale &&
      !owner &&
      doesInstantSaleHasNoItems;

    const shouldHide =
      shouldHideInstantSale ||
      auction?.vault?.info?.state === VaultState.Deactivated;

    // if (redeemData?.length > 0 || isRedeem) return <></>;

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
    if (isEnded(state) && !isInstantSale) {
      return (
        <div className={art.title && highestBid ? PaddingBox : SmallPaddingBox}>
          {art.title && highestBid && (
            <div className={BidStatus}>
              <Link
                to={`/${
                  users[bid?.info?.bidderPubkey]?.username ||
                  bid?.info?.bidderPubkey
                }`}
              >
                <Avatar
                  src={
                    users[bid?.info?.bidderPubkey]?.img_profile || (
                      <Identicon
                        address={bid?.info?.bidderPubkey}
                        style={{ width: 40 }}
                      />
                    )
                  }
                  size={40}
                />
              </Link>

              <div>
                {/* <DetailStatus
                  status={'winning bid by'}
                  username={
                    users[bid?.info?.bidderPubkey]?.username
                      ? users[bid?.info?.bidderPubkey].username
                      : shortenAddress(bid?.info?.bidderPubkey)
                  }
                  time={}
                /> */}
                <div>
                  winning bid by{' '}
                  <span className={WhiteColor}>
                    {users[bid?.info?.bidderPubkey]?.username
                      ? users[bid?.info?.bidderPubkey].username
                      : shortenAddress(bid?.info?.bidderPubkey)}
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
              <Link
                to={`/${
                  users[highestBid.info.bidderPubkey]?.username ||
                  bid?.info?.bidderPubkey
                }`}
              >
                <Avatar
                  src={
                    users[highestBid.info.bidderPubkey]?.img_profile || (
                      <Identicon
                        address={bid?.info?.bidderPubkey}
                        style={{ width: 40 }}
                      />
                    )
                  }
                  size={40}
                />
              </Link>

              <div>
                {!isInstantSale && (
                  <div>
                    current bid by{' '}
                    <Link
                      to={`/${
                        users[highestBid.info.bidderPubkey]?.username ||
                        bid?.info?.bidderPubkey
                      }`}
                    >
                      <span className={WhiteColor}>
                        {users[highestBid.info.bidderPubkey]
                          ? users[highestBid.info.bidderPubkey].username
                          : shortenAddress(highestBid.info.bidderPubkey)}
                      </span>
                    </Link>
                    <span className={NormalFont}>
                      ・
                      {moment
                        .unix(highestBid.info.lastBidTimestamp?.toNumber())
                        .fromNow()}
                    </span>
                  </div>
                )}

                <div className={CurrentBid}>
                  <span className={WhiteColor}>{currentBid} SOL</span> ending in{' '}
                  {!isInstantSale && state && (
                    <span className={WhiteColor}>
                      {state.hours > 9 ? state?.hours : `0${state.hours}`} :{' '}
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
                {!isInstantSale && <div>ending in</div>}
                {!isInstantSale && state && (
                  <div className={`${WhiteColor} ${uFontSize24}`}>
                    {state.hours > 9 ? state?.hours : `0${state.hours}`} :{' '}
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
  if (!art.title || !auction || isLoadingMetaplex || loadingDetailAuction) {
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
    if (!isInstantSale) {
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
              <ActionButton onClick={actionEndedAuctionClaim} width="100%">
                claim NFT
              </ActionButton>
            </div>
          </BidDetailsContent>
        );
      }

      // case 2: auction ended but not winning
      if (isParticipated) {
        if (isRedeem) {
          return (
            <BidDetailsContent>
              <div className={ButtonWrapper}>
                <ActionButton disabled width="100%">
                  refunded
                </ActionButton>
              </div>
            </BidDetailsContent>
          );
        } else {
          return (
            <BidDetailsContent>
              <div className={ButtonWrapper}>
                <ActionButton onClick={actionEndedAuctionRefund} width="100%">
                  refund bid
                </ActionButton>
              </div>
            </BidDetailsContent>
          );
        }
      }
      if (auction?.auctionManager.authority === publicKey?.toBase58()) {
        if (bids.length === 0) {
          return (
            <BidDetailsContent>
              <div className={ButtonWrapper}>
                <ActionButton onClick={actionEndedAuctionReclaim} width="100%">
                  reclaim NFT
                </ActionButton>
              </div>
            </BidDetailsContent>
          );
        } else {
          return (
            <BidDetailsContent>
              <div className={ButtonWrapper}>
                <ActionButton
                  to={`/auction/${auction.auction.pubkey}/settle`}
                  width="100%"
                >
                  settle
                </ActionButton>
              </div>
            </BidDetailsContent>
          );
        }
      }
      // console.log(
      //   '🚀 ~ file: index.tsx ~ line 857 ~ isInstantSale',
      //   bids,
      //   isLoadingMetaplex,
      //   Date.now(),
      // );

      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            <ActionButton disabled width="100%">
              ended auction
            </ActionButton>
          </div>
        </BidDetailsContent>
      );
    } else if (!isInstantSale) {
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

    if (isInstantSale && !eligibleForAnything) {
      return (
        <BidDetailsContent>
          <a className={ButtonWrapper}>
            <ActionButton width="100%" onClick={unlistConfirmation}>
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
    isInstantSale &&
    !(publicKey?.toBase58() === owner && !eligibleForAnything)
  ) {
    if (balance > baseInstantSalePrice) {
      return (
        <BidDetailsContent>
          <div className={ButtonWrapper}>
            {!!auction.myBidderPot && (
              <ActionButton width="100%" disabled>
                CLAIMED
              </ActionButton>
            )}

            {!auction.myBidderPot && (
              <ActionButton width="100%" onClick={instantSale}>
                BUY NOW
              </ActionButton>
            )}
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
              onClick={() => placeBid(currentBidAmount)}
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
  if (isInstantSale && isEnded(state) && eligibleForAnything) {
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
