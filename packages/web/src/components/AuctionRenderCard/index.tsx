import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Card, Col, CardProps, Row, Statistic } from 'antd';
import {
  formatTokenAmount,
  CountdownState,
  PriceFloorType,
  fromLamports,
  useMint,
  ItemAuction,
  shortenAddress,
  UserData,
  Identicon,
} from '@oyster/common';
import { ArtContent, ArtContent2 } from '../ArtContent';
import { AuctionView, AuctionViewState, useArt } from '../../hooks';
import { useHighestBidForAuction } from '../../hooks';
import { BN } from 'bn.js';
import { useAuctionStatus } from './hooks/useAuctionStatus';
import { getUsernameByPublicKeys } from '../../database/userData';
import { uTextAlignEnd } from '../../styles';
import {
  AuctionImage,
  AvatarStyle,
  BidPrice,
  CardStyle,
  NumberStyle,
  OwnerContainer,
  UserWrapper,
} from './style';
import countDown from '../../helpers/countdown';

const { Meta } = Card;
export interface AuctionCard extends CardProps {
  auctionView: ItemAuction;
  owner: UserData;
}
export const AuctionRenderCard = (props: AuctionCard) => {
  const { auctionView, owner } = props;
  const id = auctionView.id_nft;
  const art = useArt(id);
  const name = art?.title || auctionView.name;
  const [state, setState] = useState<CountdownState>();
  const [cardWidth, setCardWidth] = useState(0);

  const mintInfo = useMint(auctionView.token_mint);
  const cardRef = useRef<HTMLDivElement>(null);

  const participationFixedPrice = 0;
  const participationOnly = false;
  const priceFloor = auctionView.isInstantSale
    ? auctionView.price_floor
    : auctionView.price_floor * 1000000000;
  const isUpcoming = false;
  const now = Math.floor(new Date().getTime() / 1000);
  const endAt = auctionView.endAt;

  const winningBid = auctionView.winner;
  const ended = !auctionView.isInstantSale && endAt < now;

  let currentBid: number | string = 0;
  let label = '';
  if (isUpcoming) {
    label = ended ? 'Ended' : 'Starting bid';
    currentBid = fromLamports(
      participationOnly ? participationFixedPrice : priceFloor,
      mintInfo,
    );
  }

  if (!isUpcoming) {
    label = ended ? 'Winning bid' : 'Current bid';
    currentBid = winningBid ? auctionView.highestBid : auctionView.price_floor;
  }

  useEffect(() => {
    if (cardRef.current?.offsetWidth)
      setCardWidth(cardRef.current?.offsetWidth);
  }, [cardRef.current?.offsetWidth, setCardWidth]);

  useEffect(() => {
    if (!ended) {
      const calc = () => setState(countDown(endAt));
      const interval = setInterval(() => calc(), 1000);

      calc();
      return () => clearInterval(interval);
    }
  }, [setState, ended]);

  return (
    <Card
      hoverable={true}
      className={CardStyle}
      cover={
        <div ref={cardRef}>
          <ArtContent2
            className={AuctionImage(cardWidth)}
            preview={false}
            pubkey={id}
            uri={auctionView.original_file}
            allowMeshRender={false}
          />
        </div>
      }
    >
      <Meta
        title={name}
        description={
          <>
            <div className={UserWrapper}>
              <Avatar
                src={
                  owner.img_profile || (
                    <Identicon
                      address={owner.wallet_address}
                      style={{ width: 32 }}
                    />
                  )
                }
                size={32}
                className={AvatarStyle}
              />
              <span>
                {owner.username
                  ? owner.username
                  : shortenAddress(auctionView?.owner)}
              </span>
            </div>

            <Row>
              <Col span={12}>
                {/* case 1 & 3: live/ended and no bidder */}
                {!winningBid && <div>reserve price</div>}
                {/* case 2: live and have bidder */}
                {winningBid && !ended && <div>current bid</div>}
                {/* case 4: ended and have bidder */}
                {winningBid && ended && <div>sold for</div>}

                <Statistic
                  className={BidPrice}
                  value={currentBid}
                  suffix="SOL"
                />
              </Col>

              <Col className={uTextAlignEnd} span={12}>
                <div>
                  {/* case 1 & 2: live and have/no bidder */}
                  {!ended && !auctionView.isInstantSale && <div>ending in</div>}
                  {/* case 3: ended and no bidder */}
                  {!winningBid && ended && <div>status</div>}
                  {/* case 4: ended and have bidder */}
                  {winningBid && ended && <div>owned by</div>}
                </div>

                {ended && (
                  <div className={OwnerContainer} style={{ fontSize: 20 }}>
                    {winningBid ? shortenAddress(winningBid) : 'ended'}
                  </div>
                )}

                {!ended && !auctionView.isInstantSale && (
                  <div className={NumberStyle}>
                    {state && state.hours < 10
                      ? '0' + state?.hours
                      : state?.hours}{' '}
                    :{' '}
                    {state && state.minutes < 10
                      ? '0' + state?.minutes
                      : state?.minutes}{' '}
                    :{' '}
                    {state && state.seconds < 10
                      ? '0' + state?.seconds
                      : state?.seconds}
                  </div>
                )}
              </Col>
            </Row>
          </>
        }
      />
    </Card>
  );
};
