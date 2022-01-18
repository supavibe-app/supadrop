import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Card, CardProps, Button, Badge, Row, Col, Modal } from 'antd';
import {
  supabaseUpdateOnSaleNFT,
  supabaseUpdateStatusInstantSale,
  useConnection,
  Identicon,
  MetadataCategory,
  shortenAddress,
  StringPublicKey,
  useUserAccounts,
  useMeta,
} from '@oyster/common';
import { ArtContent } from './../ArtContent';
import { AuctionView, useBidsForAuction, useArt } from '../../hooks';
import { Artist, ArtType } from '../../types';

import { WhiteColor } from '../../styles';
import { AuctionImage, AvatarStyle, ButtonCard, CardStyle, ConfirmModal, UserWrapper } from './style';
import { Link } from 'react-router-dom';
import { SafetyDepositDraft } from '../../actions/createAuctionManager';
import { getUsernameByPublicKeys } from '../../database/userData';
import { useWallet } from '@solana/wallet-adapter-react';
import { endSale } from '../AuctionCard/utils/endSale';

const { Meta } = Card;

export interface ArtCardProps extends CardProps {
  auctionView?: AuctionView;
  pubkey?: StringPublicKey;
  artItem?: SafetyDepositDraft[];
  image?: string;
  animationURL?: string;
  isCollected?: boolean;
  soldFor?: number;
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

  isOnSale?: boolean;
  isNotForSale?: boolean;
}

export const ArtCard = (props: ArtCardProps) => {
  let {
    auctionView,
    category,
    image,
    animationURL,
    name,
    preview,
    creators,
    pubkey,
    artItem,
    isCollected,
    soldFor,
    isOnSale,
    isNotForSale,
  } = props;
  const art = useArt(pubkey);
  creators = art?.creators || creators || [];
  const [cardWidth, setCardWidth] = useState(0);

  // onsale requirements
  const walletContext = useWallet();
  const connection = useConnection();
  const { accountByMint } = useUserAccounts();
  const bids = useBidsForAuction(auctionView?.auction.pubkey || '');
  const { prizeTrackingTickets, bidRedemptions } = useMeta();

  name = art?.title || name || '';
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

  const endInstantSale = async () => {
    try {
      const wallet = walletContext;
      if (auctionView) {
        const endStatus = await endSale({
          auctionView,
          connection,
          accountByMint,
          bids,
          bidRedemptions,
          prizeTrackingTickets,
          wallet,
        });
        supabaseUpdateStatusInstantSale(auctionView.auction.pubkey);
        supabaseUpdateOnSaleNFT(auctionView.thumbnail.metadata.pubkey, false)
      }
    } catch (e) {
      console.error('endAuction', e);
      return;
    }
  };

  const unlistConfirmation = e => {
    e.preventDefault();
    Modal.confirm({
      className: ConfirmModal,
      title: 'unlist confirmation',
      content: 'Are you sure delisting your NFT?',
      onOk: endInstantSale,
      okText: 'yes',
      okType: 'text',
      cancelText: 'no',
      cancelButtonProps: { type: 'text' },
      centered: true,
      closable: true,
      icon: null,
    })
  };

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
                  data[creatorsAddress]?.img_profile || (
                    <Identicon
                      address={creatorsAddress}
                      style={{ width: 32 }}
                    />
                  )
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
              {/* Left Section */}
              {Boolean(soldFor) && (
                <Col span={12}>
                  <div>sold for</div>
                  <div className={WhiteColor}>{soldFor} SOL</div>
                </Col>
              )}

              {isNotForSale && !soldFor && (
                <Col span={12}>
                  <div>status</div>
                  <div className={WhiteColor}>not for sale</div>
                </Col>
              )}

              {/* case on sale (instant or auction). current bid / reserve price for auction; price for instant sale */}
              {/* <Col span={12}>
                <div>{'current bid' || 'reserve price' || 'price'}</div>
                <div className={WhiteColor}>... SOL</div>
              </Col> */}

              {/* Right Section */}
              {isCollected && pubkey && (
                <Col className={ButtonCard} span={12}>
                  <Link
                    to={{
                      pathname: `/list/create`,
                      state: { idNFT: pubkey },
                    }}
                  >
                    <Button shape="round">LIST</Button>
                  </Link>
                </Col>
              )}

              {isOnSale && (
                <Col className={ButtonCard} span={12}>
                  <Button shape="round" onClick={unlistConfirmation}>UNLIST</Button>
                </Col>
              )}

              {/* <Col span={12}>
                <div>listed by</div>
                <div className={WhiteColor}>{shortenAddress(art.holder)}</div>
              </Col> */}

              {/* <Col span={12}>
                <div>owner</div>
                <div className={WhiteColor}>{shortenAddress(art.holder)}</div>
              </Col> */}

              {/* <Col span={12}>
                <div>ending in</div>
                <div className={WhiteColor}>
                  {state && state.hours < 10
                    ? '0' + state?.hours
                    : state?.hours}{' '}
                  :{' '}
                  {state && state.minutes < 10
                    ? '0' + state?.minutes
                    : state?.minutes}{' '}
                  :{' '}
                  {state && state.seconds < 10
                    ? '0' + state?.seconds
                    : state?.seconds}
                </div>
              </Col> */}
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
