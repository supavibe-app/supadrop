import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, Skeleton, List, Popover, Avatar } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArrowLeftOutlined, EllipsisOutlined, TwitterOutlined } from '@ant-design/icons';

import { AuctionViewItem } from '@oyster/common/dist/lib/models/metaplex/index';
import {
  AuctionViewState,
  useArt,
  useAuction,
  useBidsForAuction,
  useExtendedArt,
  useHighestBidForAuction,
} from '../../hooks';

import {
  formatTokenAmount,
  fromLamports,
  PriceFloorType,
  shortenAddress,
  useConnectionConfig,
  useMint,
} from '@oyster/common';

import PlaceBid from './placeBid';
import ArtDetails from './artDetails';
import BidDetails from './bidDetails';
import { ArtContent } from '../../components/ArtContent';
import { ArtType } from '../../types';
import { Activity, ActivityHeader, ArtContainer, OverflowYAuto, ArtDetailsColumn, BidStatus, BoldFont, ButtonWrapper, ColumnBox, Container, ContentSection, CurrentBid, ArtDetailsHeader, IsMyBid, Label, NormalFont, PaddingBox, StatusContainer, WhiteColor, YellowGlowColor, BackButton } from './style';
import { BN } from 'bn.js';

export const AuctionItem = ({ item, active }: {
  item: AuctionViewItem;
  active?: boolean;
}) => (
  <ArtContent pubkey={item.metadata.pubkey} active={active} allowMeshRender={true} />
);

export const AuctionView = () => {
  const { id } = useParams<{ id: string }>();
  const { env } = useConnectionConfig();
  const { connected, publicKey } = useWallet();
  const auction = useAuction(id);

  const [bidAmount, setBidAmount] = useState(0);
  const setBidAmountNumber = useCallback((num: number) => setBidAmount(num), [setBidAmount]);
  const [showPlaceBid, setShowPlaceBid] = useState(false);
  const setPlaceBidVisibility = useCallback((visible: boolean) => setShowPlaceBid(visible), [setShowPlaceBid]);

  const { ref } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
  const art = useArt(auction?.thumbnail.metadata.pubkey);
  const bids = useBidsForAuction(auction?.auction.pubkey || '');
  const mint = useMint(auction?.auction.info.tokenMint);
  const mintInfo = useMint(auction?.auction.info.tokenMint);

  const participationFixedPrice = auction?.auctionManager.participationConfig?.fixedPrice || 0;
  const participationOnly = auction?.auctionManager.numWinners.eq(new BN(0));
  const priceFloor =
    auction?.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auction?.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;
  const isUpcoming = auction?.state === AuctionViewState.Upcoming;

  const highestBid = useHighestBidForAuction(auction?.auction.pubkey || '');

  let currentBid: number | string = 0;
  if (isUpcoming || bids) {
    currentBid = fromLamports(
      participationOnly ? participationFixedPrice : priceFloor,
      mintInfo,
    );
  }

  if (!isUpcoming && bids.length > 0) {
    currentBid =
      highestBid && Number.isFinite(highestBid.info.lastBid?.toNumber())
        ? formatTokenAmount(highestBid.info.lastBid)
        : 'No Bid';
  }

  let edition = '';
  switch (art.type) {
    case ArtType.NFT:
      edition = 'Unique';
      break;
    case ArtType.Master:
      edition = 'NFT 0';
      break;
    case ArtType.Print:
      edition = `edition ${art.edition} of ${art.supply} `;
      break;
  }

  const items = [
    ...(auction?.items
      .flat()
      .reduce((agg, item) => {
        agg.set(item.metadata.pubkey, item);
        return agg;
      }, new Map<string, AuctionViewItem>())
      .values() || []),
    auction?.participationItem,
  ].map(item => {
    if (!item || !item?.metadata || !item.metadata?.pubkey) {
      return null;
    }

    return (
      <AuctionItem
        key={item.metadata.pubkey}
        item={item}
      />
    );
  });

  const options = (
    <div>
      <List>
        <List.Item>
          <Button type="link" onClick={() => window.open(art.uri || '', '_blank')}>
            View on Arweave
          </Button>
        </List.Item>
        <List.Item>
          <Button
            type="link"
            onClick={() =>
              window.open(
                `https://explorer.solana.com/account/${art?.mint || ''}${env.indexOf('main') >= 0 ? '' : `?cluster=${env}`
                }`,
                '_blank',
              )
            }
          >
            View on Solana
          </Button>
        </List.Item>
      </List>
    </div>
  );

  const ArtDetailSkeleton = (
    <div>
      <div className={ContentSection}>
        <Skeleton paragraph={{ rows: 2 }} />
      </div>
      <Row>
        <Col span={12}>
          <div className={ContentSection}>
            <div className={Label}>creator</div>
            <Skeleton avatar paragraph={{ rows: 0 }} />
          </div>
        </Col>

        <Col span={12}>
          <div className={ContentSection}>
            <div className={Label}>owner</div>
            <Skeleton avatar paragraph={{ rows: 0 }} />
          </div>
        </Col>
      </Row>

      <div className={Label}>attributes</div>

      <Row gutter={[12, 12]}>
        {[...Array(3)].map(i => (
          <Col key={i}>
            <Skeleton.Button shape="round" />
          </Col>
        ))}
      </Row>
    </div>
  );

  const BidsHistorySkeleton = (
    <div>
      {[...Array(3)].map(i => (
        <Skeleton avatar paragraph={{ rows: 0 }} />
      ))}
    </div>
  );

  return (
    <Row className={Container} ref={ref}>
      <Col className={ColumnBox} span={24} md={13}>
        <div className={ArtContainer}>{items}</div>
      </Col>

      <Col className={ColumnBox} span={24} md={7}>
        <div className={ArtDetailsColumn}>
          <div className={`${OverflowYAuto} ${PaddingBox} `}>
            <div className={`${ArtDetailsHeader} ${Label} `}>
              {!art.title && <Skeleton paragraph={{ rows: 0 }} />}

              {/* Show edition if showing art details */}
              {art.title && !showPlaceBid && <div>{edition}</div>}

              {/* Show back button if showing place bid */}
              {art.title && showPlaceBid && connected && (
                <div className={BackButton} onClick={() => setPlaceBidVisibility(false)}>
                  <ArrowLeftOutlined />
                  <span className={YellowGlowColor}>{art.title}</span>
                </div>
              )}

              <Popover trigger="click" placement="bottomRight" content={options}>
                <div style={{ cursor: 'pointer', color: '#FAFAFB' }}>
                  <EllipsisOutlined />
                </div>
              </Popover>
            </div>

            {/* Show Skeleton when Loading */}
            {!art.title && ArtDetailSkeleton}

            {art.title && showPlaceBid && <PlaceBid auction={auction} setBidAmount={setBidAmountNumber} />}

            {art.title && !showPlaceBid && <ArtDetails auction={auction} />}
          </div>

          <div className={`${StatusContainer} ${PaddingBox} `}>
            {!art.title && (
              <div className={BidStatus}>
                <Skeleton avatar paragraph={{ rows: 0 }} />
              </div>
            )}
            <BidDetails
              auction={auction}
              art={art}
              highestBid={highestBid}
              bids={bids}
              showPlaceBid={showPlaceBid}
              setShowPlaceBid={setPlaceBidVisibility}
              currentBidAmount={bidAmount}
            />
          </div>
        </div>
      </Col >

      <Col className={`${ColumnBox} ${PaddingBox} `} span={24} md={4}>
        <div className={ActivityHeader}>
          <div className={YellowGlowColor}>bids history</div>
          {/* <div>activity</div> */}
        </div>

        {!art.title && BidsHistorySkeleton}

        {bids.map((bid, idx) => (
          <div key={idx}>
            {publicKey?.toBase58() === bid.info.bidderPubkey && <div className={IsMyBid} />}
            <div className={Activity}>
              <div>
                <Avatar size={24} /> {shortenAddress(bid.info.bidderPubkey)}
              </div>
              <div className={BoldFont}>
                {formatTokenAmount(bid.info.lastBid, mint)} SOL
              </div>
            </div>
          </div>
        ))}
      </Col>
    </Row >
  );
};
