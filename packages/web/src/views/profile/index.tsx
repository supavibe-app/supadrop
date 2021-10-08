import React from 'react';
import { Avatar, Button, Col, Row, Tabs } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

import { AuctionViewState, useAuctions, useCreatorArts, useUserArts } from '../../hooks';
import { ArtCard } from '../../components/ArtCard';

const { TabPane } = Tabs;

const Profile = ({ userId }: { userId: string; }) => {
  const artwork = useCreatorArts(userId);
  const ownedMetadata = useUserArts();
  const allAuctions = [
    ...useAuctions(AuctionViewState.Live),
  ]
  console.log("🚀 ~ file: index.tsx ~ line 20 ~ Profile ~ allAuctions", allAuctions.filter(m=>m.auction.pubkey==="8WkqoCD8Z171v6dLX2hwucckEdm4dpimAx6VfFhmWbCB"))
  const onSale = useAuctions(AuctionViewState.Live).filter(m=>m.auctionManager.authority===userId)
  console.log("🚀 ~ file: index.tsx ~ line 16 ~ Profile ~ onSale", onSale)

  return (
    <Row>
      <Col span={6}>
        <div>
          <Avatar size={128} />
        </div>

        <div>Raihan Hamid Suraperwata</div>

        <div>
          <div>@iyai</div>
          <div>{userId}</div>
        </div>

        <div>
          <TwitterOutlined />
          <FeatherIcon icon="globe" />
        </div>

        <div>
          Interested in web3, product, & community
        </div>

        <Button shape="round">edit profile</Button>
      </Col>

      <Col span={18}>
        <Tabs defaultActiveKey="1">
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
                  <Link to={{pathname:`/auction/create/0`,state:{idNFT:art.metadata.pubkey,item:[art]}}} key={art.metadata.pubkey}>
                  Listing
                </Link>
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane tab="On Sale" key="4">
            {onSale.map(art => (
                <Col key={art.auction.pubkey} span={8}>
                  <Link to={`/auction/${art.auction.pubkey}`}>
                    <ArtCard key={art.auction.pubkey} pubkey={art.auction.pubkey} preview={false} />
                  </Link>
                </Col>
              ))}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Profile;
