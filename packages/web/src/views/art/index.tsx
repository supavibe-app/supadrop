import React, { useEffect } from 'react';
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
import { DetailArtContent } from '../../components/Details/DetailArtContent';
import { supabase, useMeta } from '@oyster/common';

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const { art: artData, updateArt } = useMeta();
  const detailArt = artData[id];

  useEffect(() => {
    if (artData[id] === undefined) {
      supabase
        .from('nft_data')
        .select('*,id_auction(*),creator(username,wallet_address,img_profile)')
        .eq('id', id)
        .order('updated_at', { ascending: false })
        .then(res => {
          if (!res.error) {
            updateArt(res.body);
          }
        });
    }
  }, []);
  const art = useArt(id);
  const {
    location: { state },
  } = useHistory();
  const { ref, data } = useExtendedArt(id);
  // const  = Boolean(art) && Boolean(data);
  const { soldFor, nftData }: any = state || {};
  const { thumbnail, original_file, media_type } = nftData || {};

  const everSold = soldFor > 0;
  const creators = data?.creators || [];

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
          <DetailArtContent
            category={media_type || detailArt?.media_type}
            className={ArtContentStyle}
            thumbnail={thumbnail || detailArt?.thumbnail}
            originalFile={original_file || detailArt?.original_file}
          />

          {/* {<ThreeDots />} */}
        </div>
      </Col>

      {/* Art Details and Bid Details Column */}
      <Col className={ColumnBox} span={24} md={8}>
        <div className={ArtDetailsColumn}>
          <div className={`${OverflowYAuto} ${PaddingBox} `}>
            <div className={`${ArtDetailsHeader} ${Label} `}>
              {/* {! && <Skeleton paragraph={{ rows: 0 }} />} */}

              {/* Show edition if showing art details */}
              {<div>{edition}</div>}

              {(art.uri || nftData) && (
                <Popover
                  overlayClassName={OptionsPopover}
                  trigger="click"
                  placement="bottomRight"
                  content={
                    <MoreOptions
                      art={
                        art.uri
                          ? art
                          : {
                              uri: nftData?.arweave_link,
                              mint: nftData?.mint_key,
                            }
                      }
                    />
                  }
                >
                  <div style={{ cursor: 'pointer', color: '#FAFAFB' }}>
                    <FeatherIcon icon="more-horizontal" size={20} />
                  </div>
                </Popover>
              )}
            </div>

            {/* Show Skeleton when Loading */}
            {/* {! && <ArtDetailSkeleton />} */}

            {<ArtDetails nftData={artData[id]} art={art} extendedArt={data} />}
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
