import React from 'react';
import { Avatar, Button, Col, Row } from 'antd';
import { ArtDescription, ArtTitle, Attribute, AttributeRarity, ContentSection, Label, UserThumbnail } from './style';
import { IMetadataExtension, shortenAddress } from '@oyster/common';
import { AuctionView, useArt, useCreators } from '../../hooks';

const ArtDetails = ({ auction, artData }: {
  auction: AuctionView | undefined;
  artData: IMetadataExtension | undefined;
}) => {
  const creators = useCreators(auction);
  const art = useArt(auction?.thumbnail.metadata.pubkey);

  const description = artData?.description;
  const attributes = artData?.attributes;
  const owner = auction?.auction.account.owner.toString();

  return (
    <>
      <div className={ArtTitle}>{art.title}</div>

      {description && (
        <div className={`${ArtDescription} ${ContentSection}`}>
          {description}
        </div>
      )}

      <Row>
        {Boolean(creators.length) && (
          <Col span={12}>
            <div className={ContentSection}>
              <div className={Label}>{creators.length > 1 ? 'creators' : 'creator'}</div>
              {creators.map(creator => {
                if (creator.address) {
                  return (
                    <div className={UserThumbnail} key={creator.address}>
                      <Avatar size={40} /> {shortenAddress(creator.address)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </Col>
        )}

        {owner && (
          <Col span={12}>
            <div className={Label}>owner</div>
            <div className={UserThumbnail}>
              <Avatar size={40} /> {shortenAddress(owner)}
            </div>
          </Col>
        )}
      </Row>

      {attributes && (
        <div className={ContentSection}>
          <div className={Label}>attributes</div>
          <Row gutter={[12, 12]}>
            {attributes.map(attribute =>
              <Col key={attribute.trait_type}>
                <Button className={Attribute} shape="round">
                  <span>{attribute.value} –</span>
                  <span className={AttributeRarity}>{attribute.trait_type}</span>
                </Button>
              </Col>
            )}
          </Row>
        </div>
      )}
    </>
  )
};

export default ArtDetails;
