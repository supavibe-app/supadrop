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
import { useWallet } from '@solana/wallet-adapter-react';
import { endSale } from '../AuctionCard/utils/endSale';
import moment from 'moment';
import countDown from '../../helpers/countdown';
import ProfileAvatar from '../ProfileAvatar';
import { MetaAvatar } from '../MetaAvatar';

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
  onSellPage?: boolean;
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
  const { userData, updateArt } = useMeta();
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

export const ArtCardSell = (props: ArtCardProps) => {
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
    onSellPage,
  } = props;

  const art = useArt(pubkey);
  const { userData } = useMeta();
  const singleUser = useUserSingleArt(pubkey || '');

  const { location } = useHistory();
  const { state: dataState } = location;
  const { idNFT }: any = dataState || {};
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
    : nftData?.holder.username
    ? nftData?.holder.username
    : nftData?.holder.wallet_address;

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
      <Meta title={name} />
    </Card>
  );

  return art.creators?.find(c => !c.verified) ? (
    <Badge.Ribbon text="Unverified">{card}</Badge.Ribbon>
  ) : (
    card
  );
};
export interface OriginalArtCardProps extends CardProps {
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
  onClose?: () => void;

  height?: number;
  artView?: boolean;
  width?: number;

  count?: string;
}
export const OriginalArtCard = (props: OriginalArtCardProps) => {
  let {
    className,
    small,
    category,
    image,
    animationURL,
    name,
    preview,
    creators,
    description,
    onClose,
    pubkey,
    height,
    artView,
    width,
    count,
    ...rest
  } = props;
  const art = useArt(pubkey);
  creators = art?.creators || creators || [];
  name = art?.title || name || ' ';

  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    badge = `${art.edition} of ${art.supply}`;
  }

  const card = (
    <Card
      hoverable={true}
      className={`art-card ${small ? 'small' : ''} ${className ?? ''}`}
      {...rest}
    >
      {onClose && (
        <Button
          className="card-close-button"
          shape="circle"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onClose && onClose();
          }}
        >
          X
        </Button>
      )}
      <div className="art-card__header">
        <MetaAvatar creators={creators} size={32} />
        <div className="edition-badge">{badge}</div>
      </div>
      <div className="art-content__wrapper">
        <ArtContent
          pubkey={pubkey}
          uri={image}
          animationURL={animationURL}
          category={category}
          preview={preview}
          height={height}
          width={width}
          artView={artView}
        />
      </div>
      <Meta
        title={`${name}`}
        description={
          <>
            {/* {art.type === ArtType.Master && (
              <>
                <br />
                {!endAuctionAt && (
                  <span style={{ padding: '24px' }}>
                    {(art.maxSupply || 0) - (art.supply || 0)}/
                    {art.maxSupply || 0} prints remaining
                  </span>
                )}
              </>
            )} */}

            {count && (
              <div className="edition-badge">Selected count: {count}</div>
            )}
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
