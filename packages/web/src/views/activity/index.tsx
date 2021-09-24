import React from 'react';
import { Avatar, Col, Row, Tabs } from 'antd';
import { ActivityCard, NFTDescription, ImageCard, PageTitle, TabStyle, NFTStatus, NFTName, NFTOwner, Label, StatusValue, Price } from './style';

import ActionButton from '../../components/ActionButton';

const { TabPane } = Tabs;

const ActivityView = () => {
  return (
    <Row justify="center">
      <Col span={14}>
        <div className={PageTitle}>ACTIVITY</div>
        <Tabs className={TabStyle} defaultActiveKey="1">
          <TabPane tab="all" key="1">
            <div className={ActivityCard}>
              <div className={NFTDescription}>
                <div>
                  <img className={ImageCard} src="https://cdn.discordapp.com/attachments/459348449415004161/888271513575383060/0x26fd3e176c260e7fef019966622419dabfebb299_97.png" />
                </div>

                <div>
                  <div className={NFTName}>CRYSTAL GODS 07</div>
                  <div className={NFTOwner}>
                    <Avatar size={32} />
                    <div>@apri</div>
                  </div>

                  <div className={NFTStatus}>
                    <div>
                      <div className={Label}>current bid</div>
                      <div className={StatusValue}>52 SOL</div>
                    </div>
                    <div>
                      <div className={Label}>ending in</div>
                      <div className={StatusValue}>00 : 00 : 00</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className={Label}>your bid</div>
                <div className={Price}>976 SOL</div>
                <ActionButton to={'/'}>claim your NFT</ActionButton>
              </div>
            </div>
          </TabPane>
          <TabPane tab="my bids" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="on sale" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </Col >
    </Row >
  );
};

export default ActivityView;
