import React, { useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase, useMeta } from '@oyster/common';

import ActionButton from '../../components/ActionButton';
import { PageTitle, TabStyle, SubTitle, Content } from './style';
import Congratulations from '../../components/Congratulations';

import { ActivityCardMyBid } from './activityCard/ActivityCardMyBid';
import { ActivityCardOnSale } from './activityCard/ActivityCardOnSale';
import { getActiveBids, getOnSale } from '../../database/activityData';

const { TabPane } = Tabs;

const ActivityView = () => {
  const wallet = useWallet();
  const { isLoadingMetaplex } = useMeta();
  const [updatedData, setUpdatedData] = useState('');

  // if not empty, show congratulations page
  const { data: activeBids, refetch: refetchActiveBid } = getActiveBids(
    wallet.publicKey?.toBase58(),
  );
  console.log(
    '🚀 ~ file: index.tsx ~ line 25 ~ ActivityView ~ activeBids',
    activeBids,
  );

  const { data: onSale, refetch: refetchOnSale } = getOnSale(
    wallet.publicKey?.toBase58(),
  );
  console.log('🚀 ~ file: index.tsx ~ line 30 ~ ActivityView ~ onSale', onSale);

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
            {activeBids &&
              onSale &&
              [...activeBids, ...onSale].map(auction => {
                if (auction.id_auction) {
                  return (
                    <ActivityCardMyBid key={auction.id} auctionView={auction} />
                  );
                } else {
                  return (
                    <ActivityCardOnSale
                      key={auction.id}
                      auctionView={auction}
                    />
                  );
                }
              })}
            {!Boolean([...activeBids, ...onSale].length) &&
              !isLoadingMetaplex && <EmptyState />}
          </TabPane>

          <TabPane tab="my bids" key="2">
            {activeBids &&
              activeBids.map(auction => {
                return (
                  <ActivityCardMyBid key={auction.id} auctionView={auction} />
                );
              })}

            {!Boolean(activeBids.length) && !isLoadingMetaplex && (
              <EmptyState />
            )}
          </TabPane>
          <TabPane tab="on sale" key="3">
            {onSale &&
              onSale.map(auction => {
                return (
                  <ActivityCardOnSale key={auction.id} auctionView={auction} />
                );
              })}

            {!Boolean(onSale.length) && !isLoadingMetaplex && <EmptyState />}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default ActivityView;
