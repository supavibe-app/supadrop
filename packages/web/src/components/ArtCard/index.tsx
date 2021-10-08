import React, { useRef } from 'react';
import { Avatar, Card, CardProps, Button, Badge, Row, Col } from 'antd';
import { MetadataCategory, shortenAddress, StringPublicKey } from '@oyster/common';
import { ArtContent, ArtContent2 } from './../ArtContent';
import { useArt } from '../../hooks';
import { Artist, ArtType } from '../../types';

import { uTextAlignEnd } from '../../styles';
import { AuctionImage, AvatarStyle, CardStyle, UserWrapper } from './style';

const { Meta } = Card;

export interface ArtCardProps extends CardProps {
  pubkey?: StringPublicKey;

  image?: string;
  animationURL?: string;

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
  } = props;
  const art = useArt(pubkey);
  creators = art?.creators || creators || [];

  name = art?.title || name || ' ';
  const cardRef = useRef<HTMLDivElement>(null);

  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    badge = `edition ${art.edition} of ${art.supply}`;
  }

  // const card = (
  //   <Card
  //     hoverable={true}
  //     className={`art-card ${small ? 'small' : ''} ${className ?? ''}`}
  //     cover={
  //       <>
  //         {close && (
  //           <Button
  //             className="card-close-button"
  //             shape="circle"
  //             onClick={e => {
  //               e.stopPropagation();
  //               e.preventDefault();
  //               close && close();
  //             }}
  //           >
  //             X
  //           </Button>
  //         )}
  //         <ArtContent
  //           pubkey={pubkey}
  //           uri={image}
  //           animationURL={animationURL}
  //           category={category}
  //           preview={preview}
  //           height={height}
  //           width={width}
  //         />
  //       </>
  //     }
  //     {...rest}
  //   >
  //     {(creators.length > 0 && <Meta
  //       title={`${name}`}
  //       description={
  //         <>
  //           <p>owned by : {wallet.publicKey?.toBase58()}</p>
  //           <p>creators : {creators[0]?.address}</p>
  //         </>
  //       }
  //     />)}
  //   </Card>
  // );

  const card = (
    <Card
      hoverable
      className={CardStyle}
      cover={
        <div ref={cardRef}>
          <ArtContent
            className={AuctionImage(cardRef.current?.offsetWidth)}
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
              <Avatar size={32} className={AvatarStyle} />
              {/* <span>{creators[0]?.address && shortenAddress(creators[0].address)}</span> */}
            </div>

            <Row>
              <Col span={12}>
              </Col>

              <Col className={uTextAlignEnd} span={12}>
                <div>
                </div>
              </Col>
            </Row>
          </>
        }
      />
    </Card>
  );

  return art.creators?.find(c => !c.verified) ? (
    <Badge.Ribbon text="Unverified">{card}</Badge.Ribbon>
  ) : card;
};
