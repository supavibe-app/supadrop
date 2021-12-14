import React, { useEffect, useRef, useState } from 'react';
import { Card, CardProps, Button, Badge, Row, Col, Modal } from 'antd';
import {
  supabaseUpdateStatusInstantSale,
  useConnection,
  Identicon,
  MetadataCategory,
  shortenAddress,
  StringPublicKey,
  useUserAccounts,
  useMeta,
  CountdownState,
  supabaseUpdateIsRedeem,
} from '@oyster/common';
import { ArtContent } from './../ArtContent';
import {
  AuctionView,
  useBidsForAuction,
  useArt,
  useUserSingleArt,
} from '../../hooks';
import { Artist, ArtType } from '../../types';

import { uTextAlignEnd, WhiteColor } from '../../styles';
import {
  AuctionImage,
  AvatarStyle,
  ButtonCard,
  CardStyle,
  ConfirmModal,
  UserWrapper,
} from './style';
import { Link, useHistory } from 'react-router-dom';
import { SafetyDepositDraft } from '../../actions/createAuctionManager';
import { getUsernameByPublicKeys } from '../../database/userData';
import { useWallet } from '@solana/wallet-adapter-react';
import { endSale } from '../AuctionCard/utils/endSale';
import moment from 'moment';
import countDown from '../../helpers/countdown';
import ProfileAvatar from '../ProfileAvatar';

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
  nftData?: any;
  auctionData?: any;
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
    auctionView,
    category,
    image,
    animationURL,
    name,
    preview,
    creators,
    pubkey,
    nftData,
    auctionData,
    artItem,
    isCollected,
    soldFor,
  } = props;

  const art = useArt(pubkey);
  const { userData } = useMeta();
  const singleUser = useUserSingleArt(pubkey || '');

  const { location } = useHistory();
  const { state: dataState } = location;
  const { idNFT, onListingPage }: any = dataState || {};

  creators = art?.creators || creators || [];
  const [cardWidth, setCardWidth] = useState(0);
  if (!auctionData) {
    auctionData = nftData?.id_auction;
  }

  const haveLastAuction = !!auctionData;

  const isLiveAuction = auctionData?.end_auction > moment().unix();
  const isInstantSale = auctionData?.type_auction && auctionData?.isLiveMarket;
  const isOnSale = isLiveAuction || isInstantSale;
  const haveBidders = auctionData?.highest_bid > 0;
  const everSold = nftData?.sold > 0;
  const holderNFT = auctionData?.winner
    ? auctionData?.winner
    : nftData?.holder
    ? nftData?.holder
    : auctionData?.owner;

  // onsale requirements
  const walletContext = useWallet();
  if (haveLastAuction && auctionData?.winner) {
    isCollected = auctionData?.winner === walletContext.publicKey?.toBase58();
  }
  name = art?.title || name || '';
  const cardRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<CountdownState>();

  useEffect(() => {
    const calc = () => setState(countDown(auctionData?.end_auction));

    const interval = setInterval(() => calc(), 1000);
    calc();
    return () => clearInterval(interval);
  }, [nftData, setState]);

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
            uri={nftData?.thumbnail}
            animationURL={nftData?.original_file}
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
              <ProfileAvatar
                imgProfile={nftData?.creator?.img_profile}
                username={nftData?.creator?.username}
                walletAddress={nftData?.creator?.wallet_address}
              />
            </div>
            <Row>
              {/* Left Section */}
              {!isOnSale && everSold && (
                <Col span={12}>
                  <div>sold for</div>
                  <div className={WhiteColor}>{nftData.sold} SOL</div>
                </Col>
              )}

              {!isOnSale && !everSold && (
                <Col span={12}>
                  <div>status</div>
                  <div className={WhiteColor}>not for sale</div>
                </Col>
              )}

              {/* case on sale (instant or auction). current bid / reserve price for auction; price for instant sale */}
              {isOnSale && (
                <Col span={12}>
                  <div>
                    {isInstantSale
                      ? 'price'
                      : haveBidders
                      ? 'current bid'
                      : 'reserve price'}
                  </div>
                  <div className={WhiteColor}>
                    {auctionData?.highest_bid
                      ? auctionData?.highest_bid
                      : auctionData?.price_floor}{' '}
                    SOL
                  </div>
                </Col>
              )}

              {/* Right Section */}
              {art.title &&
                singleUser.length > 0 &&
                !isOnSale &&
                !onListingPage &&
                isCollected &&
                pubkey && (
                  <Col className={ButtonCard} span={12}>
                    <Link
                      to={{
                        pathname: `/list/create`,
                        state: {
                          idNFT: pubkey,
                          auctionData,
                          nftData,
                          onListingPage: true,
                        },
                      }}
                    >
                      <Button shape="round">LIST</Button>
                    </Link>
                  </Col>
                )}
              {!art.title &&
                !onListingPage &&
                isCollected &&
                pubkey &&
                !isLiveAuction && (
                  <Col className={ButtonCard} span={12}>
                    <Button shape="round" disabled>
                      please wait...
                    </Button>
                  </Col>
                )}

              {art.title && isCollected && !onListingPage && isInstantSale && (
                <Col className={ButtonCard} span={12}>
                  <Link to={`/auction/${auctionData?.id}`}>
                    <Button shape="round">UNLIST</Button>
                  </Link>
                </Col>
              )}

              {!isCollected && isInstantSale && !onListingPage && (
                <Col span={12}>
                  <div>listed by</div>
                  <div className={WhiteColor}>{shortenAddress(holderNFT)}</div>
                </Col>
              )}

              {!isCollected && !isOnSale && !onListingPage && (
                <Col span={12}>
                  <div>owner</div>
                  <div className={WhiteColor}>{shortenAddress(holderNFT)}</div>
                </Col>
              )}
              {onListingPage && (
                <Col span={12}>
                  <div>owner</div>
                  <div className={WhiteColor}>
                    {userData?.username ||
                      shortenAddress(walletContext.publicKey?.toBase58())}
                  </div>
                </Col>
              )}

              {isLiveAuction && (
                <Col span={12}>
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
