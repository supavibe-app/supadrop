import React from 'react';
import { Col, Row, Tabs } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMeta, VaultState } from '@oyster/common';

import ActivityCard from './activityCard';
import ActionButton from '../../components/ActionButton';
import { AuctionViewState, useAuctions } from '../../hooks';
import { PageTitle, TabStyle, SubTitle, Content } from './style';

const { TabPane } = Tabs;

const ActivityView = () => {
  const wallet = useWallet();
  const { isLoadingMetaplex } = useMeta();

  const allAuctions = [
    ...useAuctions(AuctionViewState.Live),
    ...useAuctions(AuctionViewState.Ended),
    ...useAuctions(AuctionViewState.Upcoming),
    ...useAuctions(AuctionViewState.BuyNow),
  ];

  //NOTE: blm ketemu buat filter yg blm settle 
  const allOnSale = allAuctions.filter(v => v.auctionManager.authority === wallet.publicKey?.toBase58());

  // NOTE: buat nentuin sudah pernah redeem atau blm cek -> m.vault.info.tokenTypeCount > 0
  // besok rencananya kucobain semua scenario, buat mastiin udah fix atau blm
  const activeBids = allAuctions.filter(m =>
    (m.myBidderMetadata?.info.bidderPubkey == wallet.publicKey?.toBase58()) &&  m.vault.info.tokenTypeCount > 0,
  );

  const onSale = allAuctions.filter(m =>
    m.vault.info.authority === wallet.publicKey?.toBase58() &&
    (m.vault.info.state !== VaultState.Deactivated || m.vault.info.tokenTypeCount > 0),
  );

//   isAuctionManagerAuthorityNotWalletOwner &&
//   auctionView.auction.info.bidState.max.toNumber() === bids.length) ||
// auctionView.vault.info.state === VaultState.Deactivated

  const complete = allAuctions.filter(m => m.vault.info.state == VaultState.Deactivated);

  if (!isLoadingMetaplex) {
    console.log("🚀 ~ file: index.tsx ~ line 57 ~ ActivityView ~ complete", complete)
    console.log("🚀 ~ file: index.tsx ~ line 33 ~ ActivityView ~ onSale", allAuctions.length, onSale)
    console.log("🚀 ~ file: index.tsx ~ line 27 ~ ActivityView ~ activeBids", activeBids)
    console.log("🚀 ~ file: index.tsx ~ line 23 ~ ActivityView ~ allOnSale", allOnSale)
    console.log('==============================================');
  }

  const EmptyState = ({ }) => (
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
            {[...activeBids, ...onSale].map(auction => <ActivityCard auctionView={auction} />)}

            {!Boolean([...activeBids, ...onSale].length) && !isLoadingMetaplex && <EmptyState />}
          </TabPane>

          <TabPane tab="my bids" key="2">
            {activeBids.map(auction => <ActivityCard auctionView={auction} />)}

            {!Boolean(activeBids.length) && !isLoadingMetaplex && <EmptyState />}
          </TabPane>
          <TabPane tab="on sale" key="3">
            {onSale.map(auction => <ActivityCard auctionView={auction} />)}

            {!Boolean(onSale.length) && !isLoadingMetaplex && <EmptyState />}
          </TabPane>
        </Tabs>
      </Col >
    </Row >
  );
};

export default ActivityView;
