import React, { useCallback, useState } from 'react';
import { Avatar, Button, Col, Row, Tabs, message } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

import { AuctionViewState, useAuctions, useCreatorArts, useUserArts } from '../../hooks';
import { ArtCard } from '../../components/ArtCard';
import { AddressSection, ArtsContent, BioSection, EditProfileButton, IconURL, NameStyle, ProfileSection, TabsStyle, UsernameSection } from './style';
import { shortenAddress } from '@oyster/common';
import EditProfile from './editProfile';
import { uTextAlignCenter } from '../../styles';
import { ArtCardOnSale } from '../../components/ArtCardOnSale';

const { TabPane } = Tabs;

const Profile = ({ userId }: { userId: string; }) => {
  const [onEdit, setOnEdit] = useState(false);
  const artwork = useCreatorArts(userId);
  const ownedMetadata = useUserArts();
  const onSale = useAuctions(AuctionViewState.Live).filter(m => m.auctionManager.authority === userId)
  const allData: any = {}
  const closeEdit = useCallback(() => setOnEdit(false), [setOnEdit]);


  onSale.forEach(data => {
    if (!allData[data.thumbnail.metadata.pubkey]) {
      allData[data.thumbnail.metadata.pubkey] = {
        type: "onSale",
        item: data
      }
    }
  })

  ownedMetadata.forEach(data => {
    if (!allData[data.metadata.pubkey]) {
      allData[data.metadata.pubkey] = {
        type: "owned",
        item: data
      }
    }
  })

  artwork.forEach(data => {
    if (!allData[data.pubkey]) {
      allData[data.pubkey] = {
        type: "created",
        item: data
      }
    }
  })

  console.log("🚀 ~ file: index.tsx ~ line 16 ~ Profile ~ onSale", onSale)

  return (
    <Row>
      <Col className={ProfileSection} span={6}>
        {onEdit && <EditProfile closeEdit={closeEdit} />}

        {/* TODO: Ambil Data profile dari database */}
        {!onEdit && (
          <div className={uTextAlignCenter}>
            <div>
              <Avatar size={128} />
            </div>

            <div className={NameStyle}>ExnD</div>

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

            <div className={UsernameSection}>@exnd</div>

            <div className={IconURL}>
              <TwitterOutlined />
              <FeatherIcon icon="globe" />
            </div>

            <div className={BioSection}>
              hissartwork’s digital art has always been a form of ventilation from his fine art background and his career in consumer marketing. His 1/1s are not always a specific curation of his work, but rather arcane concepts that allow him to experiment with both form and aesthetic without focusing on a specific style or concept. Although mostly implicit, always purposefully crafted for open interpretation.
            </div>

            <Button className={EditProfileButton} shape="round" onClick={() => setOnEdit(true)}>edit profile</Button>
          </div>
        )}
      </Col>

      <Col className={ArtsContent} span={18}>
        <Tabs className={TabsStyle} defaultActiveKey="1">
          <TabPane tab={<>All <span>{[...artwork, ...ownedMetadata, ...onSale].length}</span></>} key="1">
            <Row gutter={[36, 36]}>
              {
                Object.entries(allData).map(([key, auction]: any) => {
                  const item = auction.item
                  if (auction.type === 'onSale') {
                    return <Col key={item.auction.pubkey} span={8}>

                      {item.isInstantSale && <ArtCardOnSale auctionView={item} />}
                      {!item.isInstantSale && <Link to={`/auction/${item.auction.pubkey}`}>
                        <ArtCard key={item.auction.pubkey} pubkey={item.auction.pubkey} preview={false} />
                      </Link>}
                    </Col>
                  } else if (auction.type === 'owned') {
                    return <Col key={item.metadata.pubkey} span={8}>
                      <Link to={`/art/${item.metadata.pubkey}`}>
                        <ArtCard key={item.metadata.pubkey} pubkey={item.metadata.pubkey} preview={false} />
                      </Link>
                      <Link to={{
                        pathname: `/auction/create/0`,
                        state: { idNFT: item.metadata.pubkey, item: [item] }
                      }} key={item.metadata.pubkey}>
                        Listing
                      </Link>
                    </Col>
                  } else {
                    return <Col key={item.pubkey} span={8}>
                      <Link to={`/art/${item.pubkey}`}>
                        <ArtCard key={item.pubkey} pubkey={item.pubkey} preview={false} />
                      </Link>
                    </Col>
                  }
                })
              }
            </Row>
          </TabPane>

          <TabPane tab={<>Created <span>{artwork.length}</span></>} key="2">
            <Row gutter={[36, 36]}>
              {artwork.map(art => (
                <Col key={art.pubkey} span={8}>
                  <Link to={`/art/${art.pubkey}`}>
                    <ArtCard key={art.pubkey} pubkey={art.pubkey} preview={false} />
                  </Link>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<>Collected <span>{ownedMetadata.length}</span></>} key="3"
          >
            <Row gutter={[36, 36]}>
              {ownedMetadata.map(art => (
                <Col key={art.metadata.pubkey} span={8}>
                  <Link to={`/art/${art.metadata.pubkey}`}>
                    <ArtCard key={art.metadata.pubkey} pubkey={art.metadata.pubkey} preview={false} />
                  </Link>
                  <Link to={{
                    pathname: `/auction/create/0`, state: { idNFT: art.metadata.pubkey, item: [art] }
                  }} key={art.metadata.pubkey}>
                    Listing
                  </Link>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={<>On Sale <span>{onSale.length}</span></>} key="4">
            <Row gutter={[36, 36]}>
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
      </Col >
    </Row >
  );
};

export default Profile;
