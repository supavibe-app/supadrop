import React, { useCallback, useState } from 'react';
import { Avatar, Button, Col, Row, Tabs, message } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

import { AuctionViewState, useAuctions, useCreatorArts, useUserArts } from '../../hooks';
import { ArtCard } from '../../components/ArtCard';
import { AddressSection, ArtsContent, BioSection, EditProfileButton, EmptyRow, EmptyStyle, IconURL, NameStyle, ProfileSection, TabsStyle, UsernameSection } from './style';
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
          <TabPane tab={<>All <span>{Object.entries(allData).length}</span></>} key="1">
            <Row className={Object.entries(allData).length === 0 ? EmptyRow : ``} gutter={[36, 36]}>
              {Object.entries(allData).length === 0 && <EmptyState />}

              {Object.entries(allData).map(([key, auction]: any) => {
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
                  </Col>
                } else {
                  return <Col key={item.pubkey} span={8}>
                    <Link to={`/art/${item.pubkey}`}>
                      <ArtCard key={item.pubkey} pubkey={item.pubkey} preview={false} />
                    </Link>
                  </Col>
                }
              })}
            </Row>
          </TabPane>

          <TabPane tab={<>Created <span>{artwork.length}</span></>} key="2">
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

          <TabPane tab={<>Collected <span>{ownedMetadata.length}</span></>} key="3">
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

          <TabPane tab={<>On Sale <span>{onSale.length}</span></>} key="4">
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
      </Col >
    </Row >
  );
};

export default Profile;
