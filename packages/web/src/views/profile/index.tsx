import React, { useCallback, useState } from 'react';
import { Avatar, Button, Col, Row, Tabs, message } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

import { AuctionViewState, useAuctions, useCreatorArts, useUserArts } from '../../hooks';
import { ArtCard } from '../../components/ArtCard';
import { AddressSection, ArtsContent, BioSection, EditProfileButton, EmptyRow, EmptyStyle, IconURL, NameStyle, ProfileSection, TabsStyle, UsernameSection } from './style';
import { shortenAddress } from '@oyster/common';
import EditProfile from '../../components/Profile/EditProfile';
import { uFlexJustifyCenter, uTextAlignCenter, WhiteColor } from '../../styles';
import { ArtCardOnSale } from '../../components/ArtCardOnSale';
import { useWallet } from '@solana/wallet-adapter-react';

import { supabase } from '../../../supabaseClient';
import getUserData from '../../database/userData';
import DefaultAvatar from '../../components/DefaultAvatar';

const { TabPane } = Tabs;

const Profile = ({ userId }: { userId: string; }) => {
  const { publicKey } = useWallet();
  const [onEdit, setOnEdit] = useState(false);
  const artwork = useCreatorArts(userId);
  const ownedMetadata = useUserArts();
  const onSale = useAuctions(AuctionViewState.Live).filter(m => m.auctionManager.authority === userId)
  const allData: any = {}
  const closeEdit = useCallback(() => setOnEdit(false), [setOnEdit]);

  const isAccountOwner = publicKey?.toBase58() === userId;
  const { data: userData, loading, refetch } = getUserData(userId);

  const getProfileData = async () => {
    let { data: user_data, error } = await supabase.from('user_data')
      .select('*')
      .eq('wallet_address', userId)
      .limit(1);

    if (error) {
      console.log(error)
      return null;
    }

    if (user_data != null) {
      console.log('data_profile', user_data[0])
      return user_data[0];
    } else {
      initProfileData();
      return null;
    }
  };

  const initProfileData = async () => {
    let { data, error } = await supabase.from('user_data')
      .insert([{ wallet_address: userId }])

    if (error) {
      console.log(error)
      return
    }

    if (data != null) {
      console.log('data_profile', data[0])
    }
  }

  // TODO function OR from supabase
  // supabase.from('user_data')
  //   .select('*')
  //   .eq('wallet_address', userId)
  //   .then(data => {
  //     console.log('publickey', userId)
  //     if (data.body != null) {
  //       console.log('data_profile', data.body)
  //     }
  //   });

  // TODO function OR from supabase
  // supabase.from('user_data')
  //   .select('*')
  //   .eq('username', userId)
  //   .then(data => {
  //     console.log('publickey', userId)
  //     if (data.body != null) {
  //       console.log('data_profile', data.body)
  //     }
  //   })

  ownedMetadata.forEach(data => {
    if (!allData[data.metadata.pubkey]) {
      allData[data.metadata.pubkey] = {
        type: "owned",
        item: data
      }
    }
  });

  artwork.forEach(data => {
    if (!allData[data.pubkey]) {
      allData[data.pubkey] = {
        type: "created",
        item: data
      }
    }
  });

  const EmptyState = () => (
    <Col className={EmptyStyle} span={24}>
      <div>nothing to show</div>
      <div>haven't collect or create any NFTs yet</div>
    </Col>
  );

  return (
    <Row>
      <Col className="profile-section_mask" span={6} xs={24} sm={24} md={12} lg={6} xl={6} xxl={6} />
      <Col className={ProfileSection} span={6} xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
        {onEdit && <EditProfile userData={userData} closeEdit={closeEdit} refetch={refetch} />}

        {!onEdit && userData && (
          <div className={uTextAlignCenter} style={{ width: '100%' }}>
            <div className={uFlexJustifyCenter}>
              {userData.img_profile && <Avatar size={128} src={userData.img_profile} />}
              {!userData.img_profile && <DefaultAvatar size={128} iconSize="48" />}
            </div>

            <div className={NameStyle}>{userData.name}</div>

            <div
              className={AddressSection}
              onClick={() => {
                navigator.clipboard.writeText(userId);
                message.success('address has copied to clipboard');
              }}
            >
              <div>{shortenAddress(userId)}</div>

              <div>
                <FeatherIcon icon="copy" size="16" />
              </div>
            </div>

            {userData.username && <div className={UsernameSection}>@{userData.username}</div>}

            <div className={IconURL}>
              {userData.twitter && (
                <a className={WhiteColor} href={`https://twitter.com/${userData.twitter}`} target="_blank">
                  <TwitterOutlined />
                </a>
              )}

              {userData.website && (
                <a className={WhiteColor} href={userData.website} target="_blank">
                  <FeatherIcon icon="globe" />
                </a>
              )}
            </div>

            <div className={BioSection}>{userData.bio}</div>

            {isAccountOwner && <Button className={EditProfileButton} shape="round" onClick={() => setOnEdit(true)}>edit profile</Button>}
          </div>
        )}
      </Col>

      <Col className={ArtsContent} span={18} xs={24} sm={24} md={12} lg={18} xl={18} xxl={18}>
        <Tabs className={TabsStyle} defaultActiveKey="1">
          <TabPane tab={<>All <span>{Object.entries(allData).length < 10 ? `0${Object.entries(allData).length}` : Object.entries(allData).length}</span></>} key="1">
            <Row className={Object.entries(allData).length === 0 ? EmptyRow : ``} gutter={[36, 36]}>
              {Object.entries(allData).length === 0 && <EmptyState />}

              {Object.entries(allData).map(([key, auction]: any) => {
                const item = auction.item
                if (auction.type === 'onSale') {
                  return <Col key={item.auction.pubkey} span={8} xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
                    {item.isInstantSale && <ArtCardOnSale auctionView={item} />}

                    {!item.isInstantSale && <Link to={`/auction/${item.auction.pubkey}`}>
                      <ArtCard key={item.auction.pubkey} pubkey={item.auction.pubkey} preview={false} />
                    </Link>}
                  </Col>
                } else if (auction.type === 'owned') {
                  return <Col key={item.metadata.pubkey} span={8} xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
                    <Link to={`/art/${item.metadata.pubkey}`}>
                      <ArtCard key={item.metadata.pubkey} pubkey={item.metadata.pubkey} preview={false} />
                    </Link>
                  </Col>
                } else {
                  return <Col key={item.pubkey} span={8} xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
                    <Link to={`/art/${item.pubkey}`}>
                      <ArtCard key={item.pubkey} pubkey={item.pubkey} preview={false} />
                    </Link>
                  </Col>
                }
              })}
            </Row>
          </TabPane>

          <TabPane tab={<>Created <span>{artwork.length < 10 ? `0${artwork.length}` : artwork.length}</span></>} key="2">
            <Row className={artwork.length === 0 ? EmptyRow : ``} gutter={[36, 36]}>
              {artwork.length === 0 && <EmptyState />}

              {artwork.map(art => (
                <Col key={art.pubkey} span={8}>
                  <Link to={`/art/${art.pubkey}`}>
                    <ArtCard key={art.pubkey} pubkey={art.pubkey} preview={false} />
                  </Link>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<>Collected <span>{ownedMetadata.length < 10 ? `0${ownedMetadata.length}` : ownedMetadata.length}</span></>} key="3">
            <Row className={ownedMetadata.length === 0 ? EmptyRow : ``} gutter={[36, 36]}>
              {ownedMetadata.length === 0 && <EmptyState />}

              {ownedMetadata.map(art => (
                <Col key={art.metadata.pubkey} span={8}>
                  <Link to={`/art/${art.metadata.pubkey}`}>
                    <ArtCard key={art.metadata.pubkey} pubkey={art.metadata.pubkey} preview={false} />
                  </Link>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<>On Sale <span>{onSale.length < 10 ? `0${onSale.length}` : onSale.length}</span></>} key="4">
            <Row className={onSale.length === 0 ? EmptyRow : ``} gutter={[36, 36]}>
              {onSale.length === 0 && <EmptyState />}

              {onSale.map(art => (
                <Col key={art.auction.pubkey} span={8}>
                  {art.isInstantSale && <ArtCardOnSale auctionView={art} />}

                  {!art.isInstantSale && <Link to={`/auction/${art.auction.pubkey}`}>
                    <ArtCard key={art.auction.pubkey} pubkey={art.auction.pubkey} preview={false} />
                  </Link>}
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Profile;
