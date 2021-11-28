import React, { useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMeta, VaultState } from '@oyster/common';

import ActionButton from '../../components/ActionButton';
import {
  AuctionViewState,
  useAuctions,
  useHighestBidForAuction,
} from '../../hooks';
import { PageTitle, TabStyle, SubTitle, Content } from './style';
import Congratulations from '../../components/Congratulations';

import { ActivityCardMyBid } from './activityCard/ActivityCardMyBid';
import { ActivityCardOnSale } from './activityCard/ActivityCardOnSale';
import { getActiveBids, getOnSale } from '../../database/activityData';

const { TabPane } = Tabs;

const ActivityView = () => {
  const wallet = useWallet();
  const { isLoadingMetaplex } = useMeta();

  // if not empty, show congratulations page
  const activeBids = getActiveBids(wallet.publicKey?.toBase58()).data;
  const onSale = getOnSale(wallet.publicKey?.toBase58()).data;

  const EmptyState = ({}) => (
    <div>
      <div className={Content}>
        <div className={SubTitle}>no activity at the moment</div>
        <div>your auction or sell activity will be show up here</div>
      </div>

      <ActionButton to="/auction">view auction</ActionButton>
    </div>
  );

  return (
    <Row justify="center">
      <Col span={14}>
        <div className={PageTitle}>ACTIVITY</div>
        <Tabs className={TabStyle} defaultActiveKey="1">
          <TabPane tab="all" key="1">
            {[...activeBids, ...onSale].map(auction => {
              if (auction.id_auction) {
                return <ActivityCardMyBid auctionView={auction} />;
              } else {
                return <ActivityCardOnSale auctionView={auction} />;
              }
            })}
            {!Boolean([...activeBids, ...onSale].length) &&
              !isLoadingMetaplex && <EmptyState />}
          </TabPane>

          <TabPane tab="my bids" key="2">
            {activeBids.map(auction => {
              return <ActivityCardMyBid auctionView={auction} />;
            })}

            {!Boolean(activeBids.length) && !isLoadingMetaplex && (
              <EmptyState />
            )}
          </TabPane>
          <TabPane tab="on sale" key="3">
            {onSale.map(auction => {
              return <ActivityCardOnSale auctionView={auction} />;
            })}

            {!Boolean(onSale.length) && !isLoadingMetaplex && <EmptyState />}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default ActivityView;
