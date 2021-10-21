import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Button, Skeleton, List, Popover, Avatar } from 'antd';
import { AuctionViewItem } from '@oyster/common/dist/lib/models/metaplex/index';
import FeatherIcon from 'feather-icons-react';
import { useConnectionConfig, useMeta } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  useArt,
  useAuction,
  useBidsForAuction,
  useExtendedArt,
  useHighestBidForAuction,
} from '../../hooks';
import { ArtContent } from '../../components/ArtContent';

import { ArtType } from '../../types';
import ArtDetails from '../../components/Details/ArtDetails';
import BidDetails from '../../components/Details/BidDetails';
import PlaceBid from '../../components/Details/PlaceBid';
import TransactionHistory from '../../components/Details/TransactionHistory';
import { YellowGlowColor } from '../../styles';
// import { useMeta } from '../../contexts';
import {
  ArtContainer,
  ArtContentStyle,
  ArtDetailsColumn,
  ArtDetailsHeader,
  BackButton,
  ColumnBox,
  Container,
  ContentSection,
  Label,
  OverflowYAuto,
  OptionsPopover,
  PaddingBox,
  StatusContainer,
} from './style';

export const AuctionItem = ({ item, active }: {
  item: AuctionViewItem;
  active?: boolean;
}) => <ArtContent className={ArtContentStyle} pubkey={item.metadata.pubkey} active={active} allowMeshRender={true} />;

export const AuctionView = () => {
  const { location } = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const action = queryParams.get('action');

  const { id } = useParams<{ id: string }>();
  const { env } = useConnectionConfig();
  const { connected, publicKey } = useWallet();
  const auction = useAuction(id);
  const [bidAmount, setBidAmount] = useState<number>();
  const setBidAmountNumber = useCallback((num: number) => setBidAmount(num), [setBidAmount]);
  const [showPlaceBid, setShowPlaceBid] = useState(action === 'bid');
  const setPlaceBidVisibility = useCallback((visible: boolean) => setShowPlaceBid(visible), [setShowPlaceBid]);


  const { pullAuctionPage } = useMeta();
  useEffect(() => {
    pullAuctionPage(id);
  }, []);
  const { ref, data } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
  const art = useArt(auction?.thumbnail.metadata.pubkey);
  const bids = useBidsForAuction(auction?.auction.pubkey || '');
  const highestBid = useHighestBidForAuction(auction?.auction.pubkey || '');

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

  // Additional Components
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

    return <AuctionItem key={item.metadata.pubkey} item={item} />;
  });

  const moreOptions = (
    <List>
      <List.Item>
        <Button type="link" onClick={() => window.open(art.uri || '', '_blank')}>
          view on arweave
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
          view on solana
        </Button>
      </List.Item>
    </List>
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
  // EOF Additional Components

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
                  <FeatherIcon icon="arrow-left" size={20} />
                  <span className={YellowGlowColor}>{art.title}</span>
                </div>
              )}

              <Popover overlayClassName={OptionsPopover} trigger="click" placement="bottomRight" content={moreOptions}>
                <div style={{ cursor: 'pointer', color: '#FAFAFB' }}>
                  <FeatherIcon icon="more-horizontal" size={20} />
                </div>
              </Popover>
            </div>

            {/* Show Skeleton when Loading */}
            {!art.title && ArtDetailSkeleton}

            {art.title && showPlaceBid && <PlaceBid auction={auction} bidAmount={bidAmount} setBidAmount={setBidAmountNumber} />}
            {art.title && !showPlaceBid && <ArtDetails auction={auction} artData={data} highestBid={highestBid} />}
          </div>

          <div className={StatusContainer}>
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
        <TransactionHistory auction={auction} />
      </Col>
    </Row >
  );
};

