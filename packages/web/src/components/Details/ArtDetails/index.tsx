import React from 'react';
import { Avatar, Button, Col, Row } from 'antd';
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

const ArtDetails = ({
  auction,
  art,
  extendedArt,
  highestBid,
  users,
}: {
  auction?: ItemAuction | undefined;
  art: Art | undefined;
  extendedArt: IMetadataExtension | undefined;
  highestBid?: ParsedAccount<BidderMetadata> | undefined;
  users: any;
}) => {
  const creators = art?.creators || [];
  const title = art?.title || auction?.name;

  const description = extendedArt?.description;
  const attributes = extendedArt?.attributes;

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
                      <Avatar
                        src={
                          users[creator.address]?.img_profile || (
                            <Identicon
                              address={creator.address}
                              style={{ width: 40 }}
                            />
                          )
                        }
                        size={40}
                      />

                      <span>
                        {users[creator.address]?.username
                          ? `@${users[creator.address].username}`
                          : shortenAddress(creator.address)}
                      </span>
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
                  <>
                    <Avatar
                      src={
                        users[owner]?.img_profile || (
                          <Identicon address={owner} style={{ width: 40 }} />
                        )
                      }
                      size={40}
                    />
                    <span>
                      {users[owner]?.username
                        ? `@${users[owner].username}`
                        : shortenAddress(owner)}
                    </span>
                  </>
                )}

                {/* auction ended and have winner */}
                {ended && highestBid && (
                  <>
                    <Avatar
                      src={
                        users[highestBid?.info.bidderPubkey]?.img_profile || (
                          <Identicon
                            address={highestBid?.info.bidderPubkey}
                            style={{ width: 40 }}
                          />
                        )
                      }
                      size={40}
                    />
                    <span>
                      {users[highestBid?.info.bidderPubkey]?.username
                        ? `@${users[highestBid?.info.bidderPubkey].username}`
                        : shortenAddress(highestBid?.info.bidderPubkey)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Col>
        )}
      </Row>

      {attributes && (
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
