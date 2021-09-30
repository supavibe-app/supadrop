import React, { useMemo } from 'react';
import { Avatar, Col, Row, Tabs } from 'antd';
import { ActivityCard, NFTDescription, ImageCard, PageTitle, TabStyle, NFTStatus, NFTName, NFTOwner, Label, StatusValue, Price, ButtonWrapper, SubTitle, Content } from './style';

import ActionButton from '../../components/ActionButton';
import { AuctionViewState, useAuctions } from '../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMeta, VaultState } from '@oyster/common';
const { TabPane } = Tabs;

const ActivityView = () => {
  const { publicKey } = useWallet();
  const {vaults,isLoadingMetaplex} = useMeta();

  const allAuctions = [
    ...useAuctions(AuctionViewState.Live),
    ...useAuctions(AuctionViewState.Ended),
    ...useAuctions(AuctionViewState.Upcoming),
    ...useAuctions(AuctionViewState.BuyNow),
  ];
  //NOTE: blm ketemu buat filter yg blm settle 
  const allOnSale = allAuctions.filter(v => v.auctionManager.authority === publicKey?.toBase58())

  // NOTE: buat nentuin sudah pernah redeem atau blm cek -> m.vault.info.tokenTypeCount > 0
  // besok rencananya kucobain semua scenario, buat mastiin udah fix atau blm
  const activeBids = allAuctions
  .filter(
    (m, idx) =>
      (m.myBidderMetadata?.info.bidderPubkey == publicKey?.toBase58()) && (m.vault.info.state != VaultState.Deactivated || m.vault.info.tokenTypeCount > 0),
  );

  const onSale = allAuctions
  .filter(
    (m, idx) =>
    m.vault.info.authority === publicKey?.toBase58() &&
    (m.vault.info.state !== VaultState.Deactivated ||
    m.vault.info.tokenTypeCount > 0),
  );
  const complete = allAuctions
  .filter(
    (m, idx) =>
    (m.vault.info.state == VaultState.Deactivated ),
  );
  if (!isLoadingMetaplex) {
    console.log("🚀 ~ file: index.tsx ~ line 57 ~ ActivityView ~ complete", complete)
    console.log("🚀 ~ file: index.tsx ~ line 33 ~ ActivityView ~ onSale",allAuctions.length, onSale)
    console.log("🚀 ~ file: index.tsx ~ line 27 ~ ActivityView ~ activeBids", activeBids)
    console.log("🚀 ~ file: index.tsx ~ line 23 ~ ActivityView ~ allOnSale", allOnSale)
  
    console.log('==============================================');
  }
  
  return (
    <Row justify="center">
      <Col span={14}>
        <div className={PageTitle}>ACTIVITY</div>
        <Tabs className={TabStyle} defaultActiveKey="1">
          <TabPane tab="all" key="1">
            {/* <div className={ActivityCard}>
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

              <div className={ButtonWrapper}>
                <div className={Label}>your bid</div>
                <div className={Price}>976 SOL</div>
                <ActionButton to={'/'}>claim your NFT</ActionButton>
              </div>
            </div> */}
            <div>
              <div className={Content}>
                <div className={SubTitle}>no activity at the moment</div>
                <div>your auction or sell activity will be show up here</div>
              </div>
              <ActionButton to="/auction">view auction</ActionButton>
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
