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

const { TabPane } = Tabs;

const Profile = ({ userId }: { userId: string; }) => {
  const [onEdit, setOnEdit] = useState(false);
  const artwork = useCreatorArts(userId);
  const ownedMetadata = useUserArts();
  const allAuctions = [
    ...useAuctions(AuctionViewState.Live),
  ];

  const closeEdit = useCallback(() => setOnEdit(false), [setOnEdit]);

  console.log("🚀 ~ file: index.tsx ~ line 20 ~ Profile ~ allAuctions", allAuctions.filter(m => m.auction.pubkey === "8WkqoCD8Z171v6dLX2hwucckEdm4dpimAx6VfFhmWbCB"))
  const onSale = useAuctions(AuctionViewState.Live).filter(m => m.auctionManager.authority === userId)
  console.log("🚀 ~ file: index.tsx ~ line 16 ~ Profile ~ onSale", onSale);

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
                message.success('address has copied to clipboard')
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
          <TabPane tab="All" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Created" key="2">
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
          <TabPane tab="Collected" key="3">
            <Row gutter={[36, 36]}>
              {ownedMetadata.map(art => (
                <Col key={art.metadata.pubkey} span={8}>
                  <Link to={`/art/${art.metadata.pubkey}`}>
                    <ArtCard key={art.metadata.pubkey} pubkey={art.metadata.pubkey} preview={false} />
                  </Link>
                  <Link to={{ pathname: `/auction/create/0`, state: { idNFT: art.metadata.pubkey, item: [art] } }} key={art.metadata.pubkey}>
                    Listing
                  </Link>
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane tab="On Sale" key="4">
            {onSale.map(art => (
              <Col key={art.auction.pubkey} span={8}>
                {art.isInstantSale && <>
                  <Link to={`/auction/${art.auction.pubkey}`}>
                    <ArtCard key={art.auction.pubkey} pubkey={art.auction.pubkey} preview={false} />
                  </Link>
                  <Button onClick={() => console.log('click')}>Unlisting</Button>
                </>}
                {!art.isInstantSale && <Link to={`/auction/${art.auction.pubkey}`}>
                  <ArtCard key={art.auction.pubkey} pubkey={art.auction.pubkey} preview={false} />
                </Link>}
              </Col>
            ))}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Profile;
