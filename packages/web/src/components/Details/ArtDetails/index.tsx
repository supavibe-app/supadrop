import React from 'react';
import { Button, Col, Row } from 'antd';
import {
  BidderMetadata,
  Identicon,
  IMetadataExtension,
  ItemAuction,
  ParsedAccount,
  shortenAddress,
} from '@oyster/common';
import {
  ArtDescription,
  ArtTitle,
  Attribute,
  AttributeRarity,
  ContentSection,
  Label,
  UserThumbnail,
} from './style';
import countDown from '../../../helpers/countdown';

import { Art } from '../../../types';
import ProfileAvatar from '../../ProfileAvatar';

const ArtDetails = ({
  auction,
  art,
  extendedArt,
  highestBid,
  nftData,
}: {
  auction?: ItemAuction | undefined;
  art: Art | undefined;
  extendedArt: IMetadataExtension | undefined;
  highestBid?: ParsedAccount<BidderMetadata> | undefined;
  nftData?: any;
}) => {
  const creators = art?.creators || [];
  const title = art?.title || auction?.name || nftData?.name;

  const description = extendedArt?.description || nftData?.description;
  const attributes = extendedArt?.attributes || nftData?.attribute;

  const owner = auction?.owner;
  const endAt = auction?.endAt;

  const state = countDown(endAt);
  const ended =
    state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

  return (
    <>
      <div className={ArtTitle}>{title}</div>

      {description && (
        <div className={`${ArtDescription} ${ContentSection}`}>
          {description}
        </div>
      )}

      <Row>
        {Boolean(creators.length) && (
          <Col span={12} md={24} lg={24} xl={12}>
            <div className={ContentSection}>
              <div className={Label}>
                {creators.length > 1 ? 'creators' : 'creator'}
              </div>
              {creators.map(creator => {
                if (creator.address) {
                  return (
                    <div className={UserThumbnail} key={creator.address}>
                      <ProfileAvatar
                        key={creator.address}
                        walletAddress={creator.address}
                        size={40}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </Col>
        )}

        {owner && (
          <Col span={12} md={24} lg={24} xl={12}>
            <div className={ContentSection}>
              <div className={Label}>owner</div>
              <div className={UserThumbnail}>
                {/* auction still live */}
                {(!ended || !highestBid) && (
                  <ProfileAvatar walletAddress={owner} size={40} />
                )}

                {/* auction ended and have winner */}
                {ended && highestBid && (
                  <ProfileAvatar
                    walletAddress={highestBid?.info.bidderPubkey}
                    size={40}
                  />
                )}
              </div>
            </div>
          </Col>
        )}
      </Row>

      {attributes && attributes.length > 0 && (
        <div className={ContentSection}>
          <div className={Label}>attributes</div>
          <Row gutter={[12, 12]}>
            {attributes.map(attribute => (
              <Col key={attribute.trait_type}>
                <Button className={Attribute} shape="round">
                  <span>{attribute.trait_type} –</span>
                  <span className={AttributeRarity}>{attribute.value}</span>
                </Button>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

export default ArtDetails;
