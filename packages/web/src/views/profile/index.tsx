import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Col, Row, Skeleton, Tabs, message, Badge } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { shortenAddress, supabase, useMeta } from '@oyster/common';
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
import DefaultAvatar from '../../components/DefaultAvatar';
import EditProfile from '../../components/Profile/EditProfile';
import { ArtCardOnSale } from '../../components/ArtCardOnSale';

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
import getUserData, {
  getCollectedNFT,
  getCreatedDataNFT,
} from '../../database/userData';

const { TabPane } = Tabs;

const Profile = ({ userId }: { userId: string }) => {
  const { replace, location } = useHistory();

  const { publicKey } = useWallet();
  const { isLoadingMetaplex, pullAllMetadata } = useMeta();
  const [onEdit, setOnEdit] = useState(false);
  const closeEdit = useCallback(() => setOnEdit(false), [setOnEdit]);
  const { data: userData, loading, refetch } = getUserData(userId);

  useEffect(() => {
    if (location.state === 'refresh') {
      refetch();
    }
  }, [location.key]);

  useEffect(() => {
    if (!isLoadingMetaplex) {
      pullAllMetadata();
    }
  }, [isLoadingMetaplex]);

  const walletAddress = userData?.wallet_address;
  const collected = getCollectedNFT(walletAddress).data;
  const artwork = getCreatedDataNFT(walletAddress).data;
  const collected2 = useCollectedArts(walletAddress);

  const onSale = useAuctions(AuctionViewState.Live).filter(
    m => m.auctionManager.authority === walletAddress,
  );

  useEffect(() => {
    // if username is available, show username in the url instead of their wallet address
    if (userData && userData.username) replace(`/${userData.username}`);
  }, [loading, userData]);

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
              {userData.img_profile && (
                <Avatar size={128} src={userData.img_profile} />
              )}
              {!userData.img_profile && (
                <DefaultAvatar size={128} iconSize="48" />
              )}
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

            {publicKey?.toBase58() === userData.wallet_address && (
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
        <Tabs className={TabsStyle} defaultActiveKey="2">
          {artwork?.length > 0 && (
            <TabPane
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
              key="2"
            >
              <Row
                className={artwork.length === 0 ? EmptyRow : ``}
                gutter={[36, 36]}
              >
                {artwork.length === 0 && <EmptyState />}

                {artwork.map(art => {
                  return (
                    <Col key={art.id} span={8}>
                      <Link to={`/art/${art.id}`}>
                        <ArtCard
                          key={art.id}
                          pubkey={art.id}
                          isCollected={
                            art.holder === publicKey?.toBase58() &&
                            !art.on_sale &&
                            publicKey?.toBase58().toString() === walletAddress
                          }
                          preview
                        />
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </TabPane>
          )}

          {collected?.length > 0 && (
            <TabPane
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
              key="3"
            >
              <Row
                className={collected.length === 0 ? EmptyRow : ``}
                gutter={[36, 36]}
              >
                {collected.length === 0 && <EmptyState />}

                {collected.map(art => (
                  <Col key={art.id} span={8}>
                    <Link to={`/art/${art.id}`}>
                      <ArtCard
                        key={art.id}
                        pubkey={art.id}
                        isCollected={
                          !art.on_sale &&
                          publicKey?.toBase58().toString() === walletAddress
                        }
                        preview
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
            </TabPane>
          )}

          {onSale.length > 0 && (
            <TabPane
              tab={
                <Badge className={BadgeStyle} dot offset={[10, 10]}>
                  On Sale{' '}
                  <span>
                    {onSale.length < 10 ? `0${onSale.length}` : onSale.length}
                  </span>
                </Badge>
              }
              key="4"
            >
              <Row
                className={onSale.length === 0 ? EmptyRow : ``}
                gutter={[36, 36]}
              >
                {onSale.length === 0 && <EmptyState />}

                {onSale.map(art => (
                  <Col key={art.auction.pubkey} span={8}>
                    {!art.auction.info.endAuctionAt && (
                      <ArtCardOnSale auctionView={art} />
                    )}
                    {art.auction.info.endAuctionAt && (
                      <Link to={`/auction/${art.auction.pubkey}`}>
                        <ArtCard
                          key={art.thumbnail.metadata.pubkey}
                          pubkey={art.thumbnail.metadata.pubkey}
                          preview={false}
                        />
                      </Link>
                    )}
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
