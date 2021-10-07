import React from 'react';
import { Avatar, Button, Col, Row, Tabs } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

import { useCreatorArts } from '../../hooks';
import { ArtCard } from '../../components/ArtCard';

const { TabPane } = Tabs;

const Profile = ({ userId }: { userId: string; }) => {
  const artwork = useCreatorArts(userId);

  console.log(artwork)

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
                <Col span={8}>
                  <Link to={`/art/${art.pubkey}`}>
                    <ArtCard key={art.pubkey} pubkey={art.pubkey} preview={false} />
                  </Link>
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane tab="Collected" key="3">
            Content of Tab Pane 3
          </TabPane>
          <TabPane tab="On Sale" key="4">
            Content of Tab Pane 4
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Profile;
