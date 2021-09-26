import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, CardProps, Row, Statistic } from 'antd';
import {
  formatTokenAmount,
  CountdownState,
  PriceFloorType,
  fromLamports,
  useMint,
  ItemAuction,
} from '@oyster/common';
import { ArtContent, ArtContent2 } from '../ArtContent';
import {
  AuctionView,
  AuctionViewState,
  useArt,
  useBidsForAuction,
} from '../../hooks';
import { useHighestBidForAuction } from '../../hooks';
import { BN } from 'bn.js';
import { AuctionImage, AvatarStyle, BidPrice, CardStyle, NumberStyle, UserWrapper } from './style';

const { Meta } = Card;
export interface AuctionCard extends CardProps {
  auctionView: AuctionView;
}
export interface AuctionCard2 extends CardProps {
  auctionView: ItemAuction;
}

export const AuctionRenderCard = (props: AuctionCard) => {
  let { auctionView } = props;
  const id = auctionView.thumbnail.metadata.pubkey;
  const art = useArt(id);
  const name = art?.title || ' ';
  const [state, setState] = useState<CountdownState>();
  const bids = useBidsForAuction(auctionView.auction.pubkey);
  const mintInfo = useMint(auctionView.auction.info.tokenMint);

  const participationFixedPrice =
    auctionView.auctionManager.participationConfig?.fixedPrice || 0;
  const participationOnly = auctionView.auctionManager.numWinners.eq(new BN(0));
  const priceFloor =
    auctionView.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auctionView.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;
  const isUpcoming = auctionView.state === AuctionViewState.Upcoming;

  const winningBid = useHighestBidForAuction(auctionView.auction.pubkey);
  const ended =
    state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

  let currentBid: number | string = 0;
  let label = '';
  if (isUpcoming || bids) {
    label = ended ? 'Ended' : 'Starting bid';
    currentBid = fromLamports(
      participationOnly ? participationFixedPrice : priceFloor,
      mintInfo,
    );
  }

  if (!isUpcoming && bids.length > 0) {
    label = ended ? 'Winning bid' : 'Current bid';
    currentBid =
      winningBid && Number.isFinite(winningBid.info.lastBid?.toNumber())
        ? formatTokenAmount(winningBid.info.lastBid)
        : 'No Bid';
  }

  const auction = auctionView.auction.info;
  useEffect(() => {
    const calc = () => {
      setState(auction.timeToEnd());
    };

    const interval = setInterval(() => {
      calc();
    }, 1000);

    calc();
    return () => clearInterval(interval);
  }, [auction, setState]);

  return (
    <Card
      hoverable={true}
      className={CardStyle}
      cover={
        <ArtContent
          className={AuctionImage}
          preview={false}
          pubkey={id}
          allowMeshRender={false}
        />
      }
    >
      <Meta
        title={name}
        description={
          <>
            <div className={UserWrapper}>
              <Avatar src="https://cdn.discordapp.com/attachments/459348449415004161/888712098589319168/Frame_40_1.png" size={32} className={AvatarStyle} />@apri
            </div>

            <Row>
              <Col span={12}>
                <div>{label}</div>
                <Statistic className={BidPrice} value={currentBid} suffix="SOL" />
              </Col>

              <Col span={12}>
                <div>ending in</div>
                <div className={NumberStyle}>
                  {state && state.hours < 10 ? '0' + state?.hours : state?.hours} :{' '}
                  {state && state.minutes < 10 ? '0' + state?.minutes : state?.minutes} :{' '}
                  {state && state.seconds < 10 ? '0' + state?.seconds : state?.seconds}
                </div>
              </Col>
            </Row>
          </>
        }
      />
    </Card>
  );
};

export const AuctionRenderCard2 = (props: AuctionCard2) => {
  let { auctionView } = props;
  const id = auctionView.id_nft;
  const art = useArt(id);
  const name = art?.title || ' ';
  const [state, setState] = useState<CountdownState>();
  const bids = useBidsForAuction(auctionView.id);
  const mintInfo = useMint(auctionView.token_mint);

  const participationFixedPrice = 0;
  const participationOnly = false;
  const priceFloor = auctionView.price_floor;
  const isUpcoming = false;

  const winningBid = useHighestBidForAuction(auctionView.id);
  const ended =
    state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

  let currentBid: number | string = 0;
  let label = '';
  if (isUpcoming || bids) {
    label = ended ? 'Ended' : 'Starting bid';
    currentBid = fromLamports(
      participationOnly ? participationFixedPrice : priceFloor,
      mintInfo,
    );
  }

  if (!isUpcoming && bids.length > 0) {
    label = ended ? 'Winning bid' : 'Current bid';
    currentBid =
      winningBid && Number.isFinite(winningBid.info.lastBid?.toNumber())
        ? formatTokenAmount(winningBid.info.lastBid)
        : 'No Bid';
  }

  return (
    <Card
      hoverable={true}
      className={CardStyle}
      cover={

        <ArtContent2
          className={AuctionImage}
          preview={false}
          pubkey={id}
          uri={auctionView.img_nft}
          allowMeshRender={false}
        />
      }
    >
      <Meta
        title={name}
        description={
          <>
            <div className={UserWrapper}>
              <Avatar src="https://cdn.discordapp.com/attachments/459348449415004161/888712098589319168/Frame_40_1.png" size={32} className={AvatarStyle} />@apri
            </div>

            <Row>
              <Col span={12}>
                <div>{label}</div>
                <Statistic className={BidPrice} value={currentBid} suffix="SOL" />
              </Col>

              <Col span={12}>
                <div>ending in</div>
                <div className={NumberStyle}>
                  {state && state.hours < 10 ? '0' + state?.hours : state?.hours} :{' '}
                  {state && state.minutes < 10 ? '0' + state?.minutes : state?.minutes} :{' '}
                  {state && state.seconds < 10 ? '0' + state?.seconds : state?.seconds}
                </div>
              </Col>
            </Row>
          </>
        }
      />
    </Card>
  );
};

const CardCountdown = ({ state }: { state?: CountdownState }) => {
  return (
    <>
      {state &&
        <Row gutter={[16, 0]}>

          <Col span={8}>
            <div className={NumberStyle}>
              {state.hours < 10 && <span>0</span>}
              {state.hours}
              :
            </div>
          </Col>

          <Col span={8}>
            <div className={NumberStyle}>
              {state.minutes < 10 && <span>0</span>}
              {state.minutes}
              {state.days === 0 && ':'}
            </div>
          </Col>

          {state.days === 0 && (
            <Col span={8}>
              <div className={NumberStyle}>
                {state.seconds < 10 && <span>0</span>}
                {state.seconds}
              </div>
            </Col>
          )}
        </Row>
      }
    </>
  )
}
