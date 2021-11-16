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
import {
  getActiveBids,
  getOnSale,
  getUsernameByPublicKeys,
} from '../../database/userData';
import { ActivityCard2, ActivityCard3 } from './activityCard';

const { TabPane } = Tabs;

const uniq = a => [...new Set(a)];

const ActivityView = () => {
  const wallet = useWallet();
  const { isLoadingMetaplex } = useMeta();

  // if not empty, show congratulations page
  const [auctionID, setAuctionID] = useState('');

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

  // const userIDs = allAuctions.map(auction => auction.auctionManager.authority);
  // const { data: ownerIDs = {} } = getUsernameByPublicKeys(uniq(userIDs));

  // show congratulations page if auction id is not empty
  if (Boolean(auctionID)) return <Congratulations id={auctionID} />;

  return (
    <Row justify="center">
      <Col span={14}>
        <div className={PageTitle}>ACTIVITY</div>
        <Tabs className={TabStyle} defaultActiveKey="1">
          <TabPane tab="all" key="1">
            {[...activeBids, ...onSale].map(auction => {
              // const highestBid = useHighestBidForAuction(auction.auction.pubkey);
              // const bidderID = highestBid.info.bidderPubkey;
              // const { data: highestUserIDs = {} } = getUsernameByPublicKeys([bidderID]);

              // const users = { ...highestUserIDs, ...ownerIDs };

              // return <ActivityCard auctionView={auction} setAuctionView={setAuctionID} users={users} />
              if (auction.auction_status) {
                return <ActivityCard2 auctionView={auction} />;
              } else {
                return <ActivityCard3 auctionView={auction} />;
              }
            })}
            {!Boolean([...activeBids, ...onSale].length) &&
              !isLoadingMetaplex && <EmptyState />}
          </TabPane>

          <TabPane tab="my bids" key="2">
            {activeBids.map(auction => {
              // const highestBid = useHighestBidForAuction(auction.auction.pubkey);
              // const bidderID = highestBid.info.bidderPubkey;
              // const { data: highestUserIDs = {} } = getUsernameByPublicKeys([bidderID]);

              // const users = { ...highestUserIDs, ...ownerIDs };

              // return <ActivityCard auctionView={auction} setAuctionView={setAuctionID} users={users} />
              return <ActivityCard2 auctionView={auction} />;
            })}

            {!Boolean(activeBids.length) && !isLoadingMetaplex && (
              <EmptyState />
            )}
          </TabPane>
          <TabPane tab="on sale" key="3">
            {onSale.map(auction => {
              // const highestBid = useHighestBidForAuction(auction.auction.pubkey);
              // const bidderID = highestBid.info.bidderPubkey;
              // const { data: highestUserIDs = {} } = getUsernameByPublicKeys([bidderID]);

              // const users = { ...highestUserIDs, ...ownerIDs };

              // return <ActivityCard auctionView={auction} setAuctionView={setAuctionID} users={users} />
              return <ActivityCard3 auctionView={auction} />;
            })}

            {!Boolean(onSale.length) && !isLoadingMetaplex && <EmptyState />}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default ActivityView;
