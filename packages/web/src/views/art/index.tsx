import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col, Skeleton, Popover, Image } from 'antd';
import FeatherIcon from 'feather-icons-react';

import { useArt, useExtendedArt } from '../../hooks';

import { ArtType } from '../../types';
import { ThreeDots } from '../../components/MyLoader';
import ArtDetails from '../../components/Details/ArtDetails';
import ActionButton from '../../components/ActionButton';
import ArtDetailSkeleton from '../../components/Details/ArtDetails/skeleton';
import MoreOptions from '../../components/Details/ArtDetails/moreOptions';

import {
  ArtContainer,
  ArtContentStyle,
  ArtDetailsColumn,
  ArtDetailsHeader,
  ColumnBox,
  Container,
  Label,
  OverflowYAuto,
  OptionsPopover,
  PaddingBox,
  LabelPrice,
  PriceBox,
  StatusContainer,
} from './style';
import { getUsernameByPublicKeys } from '../../database/userData';
import { DetailArtContent } from '../../components/Details/DetailArtContent';

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();

  const art = useArt(id);
  const {
    location: { state },
  } = useHistory();
  const { ref, data } = useExtendedArt(id);
  const isDataReady = Boolean(art) && Boolean(data);
  const { soldFor, nftData }: any = state || {};
  const { thumbnail, original_file, media_type } = nftData || {};
  const everSold = soldFor > 0;
  const creators = data?.creators || [];

  const { data: users = {} } = getUsernameByPublicKeys([...creators]);

  let edition = '';
  switch (art.type) {
    case ArtType.NFT:
      edition = 'Unique';
      break;
    case ArtType.Master:
      // edition = 'NFT 0';
      edition = 'Edition 1 of 1';
      break;
    case ArtType.Print:
      edition = `edition ${art.edition} of ${art.supply} `;
      break;
  }

  return (
    <Row className={Container} ref={ref}>
      {/* Art Column */}
      <Col className={ColumnBox} span={24} md={16}>
        <div className={ArtContainer}>
          {isDataReady && (
            <DetailArtContent
              category={media_type}
              className={ArtContentStyle}
              thumbnail={thumbnail}
              originalFile={original_file}
            />
          )}

          {!isDataReady && <ThreeDots />}
        </div>
      </Col>

      {/* Art Details and Bid Details Column */}
      <Col className={ColumnBox} span={24} md={8}>
        <div className={ArtDetailsColumn}>
          <div className={`${OverflowYAuto} ${PaddingBox} `}>
            <div className={`${ArtDetailsHeader} ${Label} `}>
              {!isDataReady && <Skeleton paragraph={{ rows: 0 }} />}

              {/* Show edition if showing art details */}
              {isDataReady && <div>{edition}</div>}

              <Popover
                overlayClassName={OptionsPopover}
                trigger="click"
                placement="bottomRight"
                content={<MoreOptions art={art} />}
              >
                <div style={{ cursor: 'pointer', color: '#FAFAFB' }}>
                  <FeatherIcon icon="more-horizontal" size={20} />
                </div>
              </Popover>
            </div>

            {/* Show Skeleton when Loading */}
            {!isDataReady && <ArtDetailSkeleton />}

            {isDataReady && (
              <ArtDetails art={art} extendedArt={data} users={users} />
            )}
          </div>

          <div className={StatusContainer}>
            <div className={PaddingBox}>
              {everSold && (
                <div className={PriceBox}>
                  <div className={LabelPrice}>last sold for</div>
                  {/* TODO: Get data last price */}
                  <div>{soldFor} SOL</div>
                </div>
              )}

              <ActionButton disabled width="100%">
                not for sale
              </ActionButton>
            </div>
          </div>
        </div>
      </Col>

      {/* Bids History Column */}
      {/* <Col className={`${ColumnBox} ${PaddingBox} `} span={24} md={4}>
        <TransactionHistory auction={auctionDatabase} />
      </Col> */}
    </Row>
  );
};
