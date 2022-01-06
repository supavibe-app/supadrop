import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Col, Row, Skeleton, Tabs, message, Badge } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { Identicon, shortenAddress, useMeta } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import FeatherIcon from 'feather-icons-react';

// utils
import {
  AuctionViewState,
  useAuctions,
  useCollectedArts,
  useCreatorArts,
  useUserArts,
} from '../../hooks';
// components
import { ArtCard } from '../../components/ArtCard';
import EditProfile from '../../components/Profile/EditProfile';

// styles
import { uFlexJustifyCenter, uTextAlignCenter, WhiteColor } from '../../styles';
import {
  AddressSection,
  ArtsContent,
  BadgeStyle,
  BioSection,
  EditProfileButton,
  EmptyRow,
  EmptyStyle,
  IconURL,
  NameStyle,
  ProfileSection,
  TabsStyle,
  UsernameSection,
} from './style';
import getUserData from '../../database/userData';
import {
  getCollectedNFT,
  getCreatedDataNFT,
  getOnSaleDataNFT,
} from '../../database/nftData';
import moment from 'moment';

const { TabPane } = Tabs;

/*
  Case Art Cards:
  1. Created
    a. just minted and not for sale (✅ done)
    b. just minted and for sale (❌ blocked)
      - instant sale
      - auction
        - have bidder
        - don't have bidder
    c. on sale listed by buyer (❌ blocked)

  2. Collected
    a. on sale (❌ blocked)
      - instant sale
      - auction
        - have bidder
        - dont have bidder
    b. not for sale (❌ blocked, gatau dia ini lagi enggak di jual)

  3. On Sale
    a. instant sale (❌ blocked)
    b. auction (❌ blocked)

  blocker:
  1. gabisa bedain mana yang lagi di on sale sama engga
  2. kalau auction, gatau kapan selesainya
  3. gabisa ke halaman auction detail karena gatau publickey auction/instant sale

*/

const Profile = ({ userId }: { userId: string }) => {
  const { replace, push, location } = useHistory();
  const { publicKey } = useWallet();
  const { isLoadingMetaplex, pullAllMetadata, allDataAuctions, updateArt } =
    useMeta();
  const [onEdit, setOnEdit] = useState(false);
  const closeEdit = useCallback(() => setOnEdit(false), [setOnEdit]);
  const { data: userData, loading, refetch } = getUserData(userId);
  const ownedMetadata = useUserArts();

  useEffect(() => {
    if (location.state === 'refresh') {
      refetch();
    } else if (localStorage.getItem('reload') === 'true') {
      localStorage.setItem('reload', 'false');
      // window.location.reload();
    }
  }, [location.key]);

  useEffect(() => {
    if (!isLoadingMetaplex) {
      pullAllMetadata();
    }
  }, [isLoadingMetaplex]);

  const walletAddress = userData?.wallet_address;
  const { data: collected, loading: loadingCollected } = getCollectedNFT(
    walletAddress,
    updateArt,
  );
  const { data: artwork, loading: loadingArtwork } = getCreatedDataNFT(
    walletAddress,
    updateArt,
  );
  const collectedArt = useCollectedArts(walletAddress);

  const { data: onSale, loading: loadingOnSale } =
    getOnSaleDataNFT(walletAddress);

  const isProfileOwner = publicKey?.toBase58() === userData?.wallet_address;
  const isEmpty =
    collected.length === 0 &&
    !loadingArtwork &&
    !loadingCollected &&
    !loadingOnSale &&
    artwork.length === 0 &&
    onSale.length === 0;

  useEffect(() => {
    // if username is available, show username in the url instead of their wallet address
    if (userData && userData.username) replace(`/${userData.username}`);
  }, [loading, userData]);

  useEffect(() => refetch(), [userId]);

  const EmptyState = () => (
    <Col className={EmptyStyle} span={24}>
      <div>nothing to show</div>
      <div>haven't collect or create any NFTs yet</div>
    </Col>
  );

  const ProfileSkeleton = () => (
    <div>
      <div className={uFlexJustifyCenter}>
        <Skeleton.Avatar size={128} />
      </div>

      <div style={{ height: 24 }} />

      <div>
        <Skeleton paragraph={{ rows: 0 }} />
      </div>

      <div>
        <Skeleton paragraph={{ rows: 0 }} />
      </div>

      <div style={{ height: 18 }} />

      <div>
        <Skeleton paragraph={{ rows: 3 }} title={false} />
      </div>
    </div>
  );

  return (
    <Row>
      <Col
        className="profile-section_mask"
        xs={24}
        sm={24}
        md={12}
        lg={6}
        xl={6}
        xxl={6}
      />

      <Col
        className={ProfileSection}
        xs={24}
        sm={24}
        md={12}
        lg={6}
        xl={6}
        xxl={6}
      >
        {onEdit && (
          <EditProfile
            userData={userData}
            closeEdit={closeEdit}
            refetch={refetch}
          />
        )}

        {!userData && <ProfileSkeleton />}

        {!onEdit && userData && (
          <div className={uTextAlignCenter} style={{ width: '100%' }}>
            <div className={uFlexJustifyCenter}>
              <Avatar
                size={128}
                src={
                  userData.img_profile || (
                    <Identicon
                      address={userData.wallet_address}
                      style={{ width: 128 }}
                    />
                  )
                }
              />
            </div>

            <div className={NameStyle}>{userData.name}</div>

            <div
              className={AddressSection}
              onClick={() => {
                navigator.clipboard.writeText(userData.wallet_address);
                message.success('address has copied to clipboard');
              }}
            >
              <div>{shortenAddress(userData.wallet_address)}</div>

              <div>
                <FeatherIcon icon="copy" size="16" />
              </div>
            </div>

            {userData.username && (
              <div className={UsernameSection}>@{userData.username}</div>
            )}

            <div className={IconURL}>
              {userData.twitter && (
                <a
                  className={WhiteColor}
                  href={`https://twitter.com/${userData.twitter}`}
                  target="_blank"
                >
                  <TwitterOutlined />
                </a>
              )}

              {userData.website && (
                <a
                  className={WhiteColor}
                  href={userData.website}
                  target="_blank"
                >
                  <FeatherIcon icon="globe" />
                </a>
              )}
            </div>

            <div className={BioSection}>{userData.bio}</div>

            {isProfileOwner && (
              <Button
                className={EditProfileButton}
                shape="round"
                onClick={() => setOnEdit(true)}
              >
                edit profile
              </Button>
            )}
          </div>
        )}
      </Col>

      <Col
        className={ArtsContent}
        span={18}
        xs={24}
        sm={24}
        md={12}
        lg={18}
        xl={18}
        xxl={18}
      >
        <Tabs className={TabsStyle}>
          {artwork.length > 0 && (
            <TabPane
              key="1"
              tab={
                <>
                  Created{' '}
                  <span>
                    {artwork.length < 10
                      ? `0${artwork.length}`
                      : artwork.length}
                  </span>
                </>
              }
            >
              <Row
                className={artwork.length === 0 ? EmptyRow : ``}
                gutter={[36, 36]}
              >
                {artwork.map(art => {
                  const isLiveAuction =
                    art?.id_auction?.end_auction > moment().unix();
                  const isInstantSale =
                    art?.id_auction?.type_auction &&
                    art?.id_auction?.isLiveMarket;
                  const isOnSale = isLiveAuction || isInstantSale;

                  return (
                    <Col key={art.id} span={8}>
                      <Link
                        to={
                          isOnSale
                            ? `/auction/${art.id_auction.id}`
                            : {
                                pathname: `/art/${art.id}`,
                                state: { soldFor: art.sold, nftData: art },
                              }
                        }
                      >
                        <ArtCard
                          key={art.id}
                          name={art.name}
                          category={art.media_type}
                          nftData={art}
                          pubkey={art.id}
                          preview={false}
                          isCollected={art.holder === publicKey?.toBase58()}
                        />
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </TabPane>
          )}

          {(collected.length > 0 || isEmpty) && (
            <TabPane
              key="2"
              tab={
                <>
                  Collected{' '}
                  <span>
                    {collected.length < 10
                      ? `0${collected.length}`
                      : collected.length}
                  </span>
                </>
              }
            >
              <Row
                className={collected.length === 0 ? EmptyRow : ``}
                gutter={[36, 36]}
              >
                {isEmpty && <EmptyState />}

                {collected.map(art => {
                  const isLiveAuction =
                    art?.id_auction?.end_auction > moment().unix();
                  const isInstantSale =
                    art?.id_auction?.type_auction &&
                    art?.id_auction?.isLiveMarket;
                  const isOnSale = isLiveAuction || isInstantSale;
                  return (
                    <Col key={art.id} span={8}>
                      <Link
                        to={
                          isOnSale
                            ? `/auction/${art.id_auction.id}`
                            : {
                                pathname: `/art/${art.id}`,
                                state: { soldFor: art.sold, nftData: art },
                              }
                        }
                      >
                        <ArtCard
                          key={art.id}
                          pubkey={art.id}
                          name={art.name}
                          category={art.media_type}
                          isCollected={art.holder === publicKey?.toBase58()}
                          nftData={art}
                          preview={false}
                        />
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </TabPane>
          )}

          {onSale.length > 0 && (
            <TabPane
              key="3"
              tab={
                <Badge className={BadgeStyle} dot offset={[10, 10]}>
                  On Sale{' '}
                  <span>
                    {onSale.length < 10 ? `0${onSale.length}` : onSale.length}
                  </span>
                </Badge>
              }
            >
              <Row
                className={onSale.length === 0 ? EmptyRow : ``}
                gutter={[36, 36]}
              >
                {onSale.map(auction => (
                  <Col key={auction.id} span={8}>
                    <Link to={`/auction/${auction.id}`}>
                      <ArtCard
                        key={auction.id}
                        pubkey={auction.id_nft.id}
                        name={auction.id_nft.name}
                        category={auction.id_nft.category}
                        auctionData={auction}
                        nftData={auction.id_nft}
                        preview={false}
                        isCollected={auction.owner === publicKey?.toBase58()}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
            </TabPane>
          )}
        </Tabs>
      </Col>
    </Row>
  );
};

export default Profile;
