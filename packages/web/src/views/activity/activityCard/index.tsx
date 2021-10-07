import React, { useEffect, useState } from 'react';
import { Avatar, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { NFTStatus, NFTName, Label, StatusValue, Price, ButtonWrapper, ActivityCardStyle, NFTDescription, ImageCard, UserContainer } from './style';

import ActionButton from '../../../components/ActionButton';
import { AuctionView, useArt, useBidsForAuction, useHighestBidForAuction, useUserBalance } from '../../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { AuctionViewItem, CountdownState, formatTokenAmount, fromLamports, PriceFloorType, shortenAddress, useConnection, useMeta, useMint, useUserAccounts } from '@oyster/common';
import { eligibleForParticipationPrizeGivenWinningIndex, sendRedeemBid } from '../../../actions/sendRedeemBid';
import { ArtContent } from '../../../components/ArtContent';
import { sendCancelBid } from '../../../actions/cancelBid';
import { supabase } from '../../../../supabaseClient'

export const AuctionItem = ({ item, active }: {
  item: AuctionViewItem;
  active?: boolean;
}) => <ArtContent className={ImageCard} pubkey={item.metadata.pubkey} active={active} allowMeshRender={true} />;

const ActivityCard = ({ auctionView }: { auctionView: AuctionView }) => {
  const wallet = useWallet();
  const connection = useConnection();
  const { bidRedemptions, prizeTrackingTickets } = useMeta();
  const isAuctionManagerAuthorityWalletOwner = auctionView.auctionManager.authority === wallet?.publicKey?.toBase58();

  const mintKey = auctionView.auction.info.tokenMint;
  const balance = useUserBalance(mintKey);
  const myPayingAccount = balance.accounts[0];
  const { accountByMint } = useUserAccounts();

  const { publicKey } = useWallet();
  const art = useArt(auctionView?.thumbnail.metadata.pubkey);
  const owner = auctionView.auctionManager.authority.toString();
  const highestBid = useHighestBidForAuction(auctionView.auction.pubkey);
  const bids = useBidsForAuction(auctionView.auction.pubkey || '').filter(bid => (
    publicKey?.toBase58() === bid.info.bidderPubkey
  ));
  const mint = useMint(auctionView.auction.info.tokenMint);

  const [state, setState] = useState<CountdownState>();
  const ended = state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

  let winnerIndex: number | null = null;
  if (auctionView.myBidderPot?.pubkey) {
    winnerIndex = auctionView.auction.info.bidState.getWinnerIndex(
      auctionView.myBidderPot?.info.bidderAct,
    );
  }

  const eligibleForOpenEdition = eligibleForParticipationPrizeGivenWinningIndex(
    winnerIndex,
    auctionView,
    auctionView.myBidderMetadata,
    auctionView.myBidRedemption,
  );

  const eligibleForAnything = winnerIndex !== null || eligibleForOpenEdition;

  const mintInfo = useMint(auctionView.auction.info.tokenMint);
  const priceFloor =
    auctionView.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auctionView.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;

  const bid = useHighestBidForAuction(auctionView.auction.pubkey || '');
  const reservePrice = parseFloat(formatTokenAmount(bid?.info.lastBid)) || fromLamports(priceFloor, mintInfo);

  const isButtonDisabled = !myPayingAccount ||
    (!auctionView.myBidderMetadata && !isAuctionManagerAuthorityWalletOwner) ||
    !!auctionView.items.find(i => i.find(item => !item.metadata));

  const isOwner = publicKey?.toBase58() === auctionView.auctionManager.pubkey;

  // countdown
  useEffect(() => {
    if (!ended) {
      const calc = () => setState(auctionView.auction.info.timeToEnd());

      const interval = setInterval(() => calc(), 1000);
      calc();
      return () => clearInterval(interval);
    }
  }, [auctionView, setState]);

  const items = [
    ...(auctionView?.items
      .flat()
      .reduce((agg, item) => {
        agg.set(item.metadata.pubkey, item);
        return agg;
      }, new Map<string, AuctionViewItem>())
      .values() || []),
    auctionView?.participationItem,
  ].map(item => {
    if (!item || !item?.metadata || !item.metadata?.pubkey) {
      return null;
    }

    return <AuctionItem key={item.metadata.pubkey} item={item} />;
  });

  const redeemBid = async () => (
    await sendRedeemBid(
      connection,
      wallet,
      myPayingAccount.pubkey,
      auctionView,
      accountByMint,
      prizeTrackingTickets,
      bidRedemptions,
      bids,
    ).then(() => {
      // setShowRedeemedBidModal(true)
      // TODO ADD FLAG TO DB
      supabase.from('action_bidding')
      .update({is_redeem:true,})
      .eq('id', `${auctionView.auction.pubkey}_${myPayingAccount.pubkey}`);
    })
  );

  const cancelBid = async () => (
    await sendCancelBid( // kalo bidder kalah, refund bid 
      connection,
      wallet,
      myPayingAccount.pubkey,
      auctionView,
      accountByMint,
      bids,
      bidRedemptions,
      prizeTrackingTickets,
    )
  );

  return (
    <Row className={ActivityCardStyle}>
      <Col className={NFTDescription} span={18}>
        <Link to={`/auction/${auctionView.auction.pubkey}`}>
          <Row>
            <Col flex={1}>{items}</Col>
            <Col flex={3}>
              <div className={NFTName}>{art.title}</div>
              <div className={UserContainer}>
                <Avatar size={32} />
                <div>{shortenAddress(owner)}</div>
              </div>

              <div className={NFTStatus}>
                {/* case 1: my bids - auction still live */}
                {!ended && !isOwner && (
                  <>
                    <div>
                      <div className={Label}>current bid</div>
                      <div className={StatusValue}>{highestBid && formatTokenAmount(highestBid.info.lastBid)} SOL</div>
                    </div>

                    <div>
                      <div className={Label}>ending in</div>
                      {state && (
                        <div className={StatusValue}>
                          {state.hours} :{' '}
                          {state.minutes > 0 ? state.minutes : `0${state.minutes}`} :{' '}
                          {state.minutes > 0 ? state.minutes : `0${state.minutes}`}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* case 2: my bids - auction ended */}
                {ended && !isOwner && (
                  <>
                    <div>
                      <div className={Label}>highest bid</div>
                      <div className={StatusValue}>{highestBid && formatTokenAmount(highestBid.info.lastBid)} SOL</div>
                    </div>

                    {/* case 2.1: my bids - win */}
                    {highestBid && publicKey?.toBase58() === highestBid.info.bidderPubkey && (
                      <div>
                        <div className={Label}>auction ended</div>
                        <div className={StatusValue} style={{ color: '#4CD964' }}>you won!</div>
                      </div>
                    )}

                    {/* case 2.2: my bids - lose */}
                    {highestBid && publicKey?.toBase58() !== highestBid.info.bidderPubkey && (
                      <div>
                        <div className={Label}>winning bid</div>
                        <div className={UserContainer}>
                          <Avatar size={32} />
                          <span>{shortenAddress(highestBid.info.bidderPubkey)}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* case 3: on sale - no bid */}
                {!highestBid && isOwner && (
                  <>
                    <div>
                      <div className={Label}>reserve price</div>
                      <div className={StatusValue}>{reservePrice} SOL</div>
                    </div>

                    {/* case 3.1: on sale - auction ended and no bid */}
                    {ended && (
                      <div>
                        <div className={Label}>ending in</div>
                        <div className={StatusValue}>ended</div>
                      </div>
                    )}
                  </>
                )}

                {/* case 4: on sale - have bidder */}
                {highestBid && isOwner && (
                  <>
                    <div>
                      <div className={Label}>{ended ? 'highest bid' : 'current bid'}</div>
                      <div className={StatusValue}>{highestBid && formatTokenAmount(highestBid.info.lastBid)} SOL</div>
                    </div>

                    {/* case 4.1: on sale - auction ended */}
                    {!ended && (
                      <div>
                        <div className={Label}>bid by</div>
                        <div className={UserContainer}>
                          <Avatar size={32} />
                          <span>{shortenAddress(highestBid.info.bidderPubkey)}</span>
                        </div>
                      </div>
                    )}

                    {/* case 4.2: on sale - auction still live */}
                    {ended && (
                      <div>
                        <div className={Label}>bid by</div>
                        <div className={UserContainer}>
                          <Avatar size={32} />
                          <span>{shortenAddress(highestBid.info.bidderPubkey)}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Link>
      </Col>

      <Col className={ButtonWrapper} span={6}>
        {!isOwner && (
          <>
            <div className={Label}>your bid</div>
            <div className={Price}>
              {Boolean(bids.length) && publicKey?.toBase58() === bids[0].info.bidderPubkey && (
                formatTokenAmount(bids[0].info.lastBid, mint)
              )} SOL
            </div>
          </>
        )}

        {isOwner && ended && highestBid && (
          <>
            <div className={Label}>settle fund</div>
            <div className={Price}>
              {Boolean(bids.length) && publicKey?.toBase58() === bids[0].info.bidderPubkey && (
                formatTokenAmount(bids[0].info.lastBid, mint)
              )} SOL
            </div>
          </>
        )}

        {isOwner && (
          <>
            <div className={Label}>ending in</div>
            {state && !ended && (
              <div className={StatusValue}>
                {state.hours} :{' '}
                {state.minutes > 0 ? state.minutes : `0${state.minutes}`} :{' '}
                {state.minutes > 0 ? state.minutes : `0${state.minutes}`}
              </div>
            )}

            {ended && (
              <div className={StatusValue}>
                auction ended
              </div>
            )}
          </>
        )}

        {/* case 1: auction still live */}
        {!ended && <ActionButton to={`/auction/${auctionView.auction.pubkey}`}>bid again</ActionButton>}

        {/* case 2.1: auction ended & win */}
        {/* claim, terus ke kongretulesen page */}
        {ended && eligibleForAnything && (
          <ActionButton
            disabled={isButtonDisabled}
            onClick={e => {
              e.stopPropagation();
              redeemBid();
            }}
          >
            {isOwner ? 'settle' : 'claim your NFT'}
          </ActionButton>
        )}

        {/* case 2.2: auction ended & lose */}
        {ended && !eligibleForAnything && (
          <ActionButton
            disabled={isButtonDisabled}
            onClick={e => {
              e.stopPropagation();
              cancelBid();
            }}
          >
            {isOwner ? 'reclaim NFT' : 'refund bid'}
          </ActionButton>
        )}

      </Col>
    </Row>
  );
};

export default ActivityCard;
