import React from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Skeleton, Popover, Image } from 'antd';
import FeatherIcon from 'feather-icons-react';

import {
  useArt,
  useExtendedArt,
} from '../../hooks';

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

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();

  const art = useArt(id);
  // let badge = '';
  // let maxSupply = '';
  // if (art.type === ArtType.NFT) {
  //   badge = 'Unique';
  // } else if (art.type === ArtType.Master) {
  //   badge = 'NFT 0';
  //   if (art.maxSupply !== undefined) {
  //     maxSupply = art.maxSupply.toString();
  //   } else {
  //     maxSupply = 'Unlimited';
  //   }
  // } else if (art.type === ArtType.Print) {
  //   badge = `${art.edition} of ${art.supply}`;
  // }
  const { ref, data } = useExtendedArt(id);
  const isDataReady = Boolean(art) && Boolean(data);

  const creators = data?.creators || [];

  const { data: users = {} } = getUsernameByPublicKeys([...creators])

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

  return (
    <Row className={Container} ref={ref}>
      {/* Art Column */}
      <Col className={ColumnBox} span={24} md={16}>
        <div className={ArtContainer}>
          {isDataReady && (
            <Image
              src={data?.image}
              wrapperClassName={ArtContentStyle}
              loading="lazy"
              placeholder={<ThreeDots />}
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

              <Popover overlayClassName={OptionsPopover} trigger="click" placement="bottomRight" content={<MoreOptions art={art} />}>
                <div style={{ cursor: 'pointer', color: '#FAFAFB' }}>
                  <FeatherIcon icon="more-horizontal" size={20} />
                </div>
              </Popover>
            </div>

            {/* Show Skeleton when Loading */}
            {!isDataReady && <ArtDetailSkeleton />}

            {isDataReady && <ArtDetails art={art} extendedArt={data} users={users} />}
          </div>

          <div className={StatusContainer}>
            <div className={PaddingBox}>
              <div className={PriceBox}>
                <div className={LabelPrice}>last sold for</div>
                {/* TODO: Get data last price */}
                <div>100 SOL</div>
              </div>

              <ActionButton disabled width="100%">not for sale</ActionButton>
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