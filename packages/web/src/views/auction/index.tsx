import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Skeleton, Popover, Image } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { useMeta } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  useArt,
  useAuction,
  useBidsForAuction,
  useExtendedArt,
  useHighestBidForAuction,
} from '../../hooks';

import { ArtType } from '../../types';
import { ThreeDots } from '../../components/MyLoader';
import ArtDetails from '../../components/Details/ArtDetails';
import BidDetails from '../../components/Details/BidDetails';
import PlaceBid from '../../components/Details/PlaceBid';
import TransactionHistory from '../../components/Details/TransactionHistory';
import ArtDetailSkeleton from '../../components/Details/ArtDetails/skeleton';
import MoreOptions from '../../components/Details/ArtDetails/moreOptions';

import { YellowGlowColor } from '../../styles';
import {
  ArtContainer,
  ArtContentStyle,
  ArtDetailsColumn,
  ArtDetailsHeader,
  BackButton,
  ColumnBox,
  Container,
  Label,
  OverflowYAuto,
  OptionsPopover,
  PaddingBox,
  StatusContainer,
} from './style';

export const AuctionView = () => {
  const { location } = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const action = queryParams.get('action');

  const { id } = useParams<{ id: string }>();
  const { connected } = useWallet();
  const auction = useAuction(id);

  const [bidAmount, setBidAmount] = useState<number>();
  const [showPlaceBid, setShowPlaceBid] = useState(action === 'bid');

  const setBidAmountNumber = useCallback((num: number) => setBidAmount(num), [setBidAmount]);
  const setPlaceBidVisibility = useCallback((visible: boolean) => setShowPlaceBid(visible), [setShowPlaceBid]);

  const { liveDataAuctions, isLoadingDatabase, pullAuctionPage } = useMeta();
  const auctionDatabase = liveDataAuctions[id];

  const { ref, data } = useExtendedArt(auctionDatabase?.id_nft);
  const art = useArt(auctionDatabase?.id_nft);
  const bids = useBidsForAuction(auctionDatabase?.id);
  const highestBid = useHighestBidForAuction(auctionDatabase?.id);

  const isDataReady = !isLoadingDatabase && auctionDatabase;

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


  useEffect(() => {
    pullAuctionPage(id);
  }, []);

  return (
    <Row className={Container} ref={ref}>
      {/* Art Column */}
      <Col className={ColumnBox} span={24} md={13}>
        <div className={ArtContainer}>
          {isDataReady && (
            <Image
              src={auctionDatabase.img_nft}
              wrapperClassName={ArtContentStyle}
              loading="lazy"
              placeholder={<ThreeDots />}
            />
          )}

          {!isDataReady && <ThreeDots />}
        </div>
      </Col>

      {/* Art Details and Bid Details Column */}
      <Col className={ColumnBox} span={24} md={7}>
        <div className={ArtDetailsColumn}>
          <div className={`${OverflowYAuto} ${PaddingBox} `}>
            <div className={`${ArtDetailsHeader} ${Label} `}>
              {!isDataReady && <Skeleton paragraph={{ rows: 0 }} />}

              {/* Show edition if showing art details */}
              {isDataReady && !showPlaceBid && <div>{edition}</div>}

              {/* Show back button if showing place bid */}
              {isDataReady && showPlaceBid && connected && (
                <div className={BackButton} onClick={() => setPlaceBidVisibility(false)}>
                  <FeatherIcon icon="arrow-left" size={20} />
                  <span className={YellowGlowColor}>{art.title}</span>
                </div>
              )}

              <Popover overlayClassName={OptionsPopover} trigger="click" placement="bottomRight" content={<MoreOptions art={art} />}>
                <div style={{ cursor: 'pointer', color: '#FAFAFB' }}>
                  <FeatherIcon icon="more-horizontal" size={20} />
                </div>
              </Popover>
            </div>

            {/* Show Skeleton when Loading */}
            {!isDataReady && <ArtDetailSkeleton />}

            {isDataReady && showPlaceBid && <PlaceBid auction={auctionDatabase} bidAmount={bidAmount} setBidAmount={setBidAmountNumber} />}
            {isDataReady && !showPlaceBid && <ArtDetails auction={auctionDatabase} art={art} extendedArt={data} highestBid={highestBid} />}
          </div>

          <div className={StatusContainer}>
            <BidDetails
              auction={auction}
              auctionDatabase={auctionDatabase}
              art={art}
              highestBid={highestBid}
              bids={bids}
              showPlaceBid={showPlaceBid}
              setShowPlaceBid={setPlaceBidVisibility}
              currentBidAmount={bidAmount}
            />
          </div>
        </div>
      </Col>

      {/* Bids History Column */}
      <Col className={`${ColumnBox} ${PaddingBox} `} span={24} md={4}>
        <TransactionHistory auction={auctionDatabase} />
      </Col>
    </Row>
  );
};
