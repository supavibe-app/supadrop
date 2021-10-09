import React from 'react';
import { Avatar, Button, Col, Row, Tabs } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

import { AuctionViewState, useAuctions, useCreatorArts, useUserArts, AuctionView } from '../../hooks';
import { ArtCard } from '../../components/ArtCard';
import { ArtCardOnSale } from '../../components/ArtCardOnSale';
import { SafetyDepositDraft } from '../../actions/createAuctionManager';

const { TabPane } = Tabs;

const Profile = ({ userId }: { userId: string; }) => {
  const artwork = useCreatorArts(userId);
  const ownedMetadata = useUserArts();
  const onSale = useAuctions(AuctionViewState.Live).filter(m => m.auctionManager.authority === userId)
  const allData: any = {}

  

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
          <Row gutter={[36, 36]}>
            {
              Object.entries(allData).map(([key, auction]:any) => {
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
                  <Link to={{
                    pathname: `/auction/create/0`, state: { idNFT: art.metadata.pubkey, item: [art] }
                  }} key={art.metadata.pubkey}>
                    Listing
                  </Link>
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane tab="On Sale" key="4">
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
      </Col>
    </Row>
  );
};

export default Profile;
