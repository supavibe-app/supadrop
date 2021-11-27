import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Card, CardProps, Button, Badge, Row, Col } from 'antd';
import {
  MetadataCategory,
  shortenAddress,
  StringPublicKey,
} from '@oyster/common';
import { ArtContent } from './../ArtContent';
import { useArt } from '../../hooks';
import { Artist, ArtType } from '../../types';

import { uTextAlignEnd } from '../../styles';
import { AuctionImage, AvatarStyle, CardStyle, UserWrapper } from './style';
import { Link } from 'react-router-dom';
import { SafetyDepositDraft } from '../../actions/createAuctionManager';
import { getUsernameByPublicKeys } from '../../database/userData';

const { Meta } = Card;

export interface ArtCardProps extends CardProps {
  pubkey?: StringPublicKey;
  artItem?: SafetyDepositDraft[];
  image?: string;
  animationURL?: string;
  isCollected?: boolean;
  category?: MetadataCategory;

  name?: string;
  symbol?: string;
  description?: string;
  creators?: Artist[];
  preview?: boolean;
  small?: boolean;
  close?: () => void;

  height?: number;
  width?: number;
}

export const ArtCard = (props: ArtCardProps) => {
  let {
    category,
    image,
    animationURL,
    name,
    preview,
    creators,
    pubkey,
    artItem,
    isCollected,
  } = props;
  const art = useArt(pubkey);
  creators = art?.creators || creators || [];
  const [cardWidth, setCardWidth] = useState(0);

  name = art?.title || name || ' ';
  const cardRef = useRef<HTMLDivElement>(null);

  const creatorsAddress = creators[0]?.address || '';

  const { data = {} } = getUsernameByPublicKeys([creatorsAddress]);

  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    badge = `edition ${art.edition} of ${art.supply}`;
  }

  useEffect(() => {
    if (cardRef.current?.offsetWidth)
      setCardWidth(cardRef.current?.offsetWidth);
  }, [cardRef.current?.offsetWidth, setCardWidth]);

  const card = (
    <Card
      hoverable
      className={CardStyle}
      cover={
        <div ref={cardRef}>
          <ArtContent
            className={AuctionImage(cardWidth)}
            preview={preview}
            pubkey={pubkey}
            uri={image}
            animationURL={animationURL}
            category={category}
            allowMeshRender={false}
          />
        </div>
      }
    >
      <Meta
        title={name}
        description={
          <>
            <div className={UserWrapper}>
              <Avatar
                src={
                  data[creatorsAddress]
                    ? data[creatorsAddress].img_profile
                    : null
                }
                size={32}
                className={AvatarStyle}
              />
              <span>
                {data[creatorsAddress]
                  ? data[creatorsAddress].username
                  : shortenAddress(creatorsAddress)}
              </span>
            </div>

            <Row>
              <Col span={12}>
                <div>sold for</div>
                <div>... SOL</div>
              </Col>

              {isCollected && (
                <Col className={uTextAlignEnd} span={12}>
                  <Link
                    to={{
                      pathname: `/list/create`,
                      state: { idNFT: pubkey},
                    }}
                  >
                    <Button shape="round">LIST</Button>
                  </Link>
                </Col>
              )}
            </Row>
          </>
        }
      />
    </Card>
  );

  return art.creators?.find(c => !c.verified) ? (
    <Badge.Ribbon text="Unverified">{card}</Badge.Ribbon>
  ) : (
    card
  );
};
