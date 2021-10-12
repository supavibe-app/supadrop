import React from 'react';
import { Avatar, Button, Col, Row } from 'antd';
import { ArtDescription, ArtTitle, Attribute, AttributeRarity, ContentSection, Label, UserThumbnail } from './style';
import { BidderMetadata, IMetadataExtension, ParsedAccount, shortenAddress } from '@oyster/common';
import { AuctionView, useArt, useCreators } from '../../hooks';

const ArtDetails = ({ auction, artData, highestBid }: {
  auction: AuctionView | undefined;
  artData: IMetadataExtension | undefined;
  highestBid: ParsedAccount<BidderMetadata> | undefined;
}) => {
  const creators = useCreators(auction);
  const art = useArt(auction?.thumbnail.metadata.pubkey);

  const description = artData?.description;
  const attributes = artData?.attributes;
  const owner = auction?.auctionManager.authority.toString();
  const state = auction?.auction.info.timeToEnd();
  const ended = state?.hours === 0 && state?.minutes === 0 && state?.seconds === 0;

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
          <Col span={12} md={24} lg={24} xl={12}>
            <div className={ContentSection}>
              <div className={Label}>{creators.length > 1 ? 'creators' : 'creator'}</div>
              {creators.map(creator => {
                if (creator.address) {
                  return (
                    <div className={UserThumbnail} key={creator.address}>
                      <Avatar size={40} />
                      <span>{shortenAddress(creator.address)}</span>
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
                <Avatar size={40} />
                {/* auction still live */}
                {(!ended || !highestBid) && <span>{shortenAddress(owner)}</span>}
                {/* auction ended and have winner */}
                {ended && highestBid && <span>{shortenAddress(highestBid.info.bidderPubkey)}</span>}
              </div>
            </div>
          </Col>
        )}
      </Row>

      {
        attributes && (
          <div className={ContentSection}>
            <div className={Label}>attributes</div>
            <Row gutter={[12, 12]}>
              {attributes.map(attribute =>
                <Col key={attribute.trait_type}>
                  <Button className={Attribute} shape="round">
                    <span>{attribute.trait_type} –</span>
                    <span className={AttributeRarity}>{attribute.value}</span>
                  </Button>
                </Col>
              )}
            </Row>
          </div>
        )
      }
    </>
  )
};

export default ArtDetails;
