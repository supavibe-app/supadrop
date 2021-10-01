import React, { useMemo } from 'react';
import { Avatar, Col, Row, Tabs, Button, Spin } from 'antd';
import { ActivityCard, NFTDescription, ImageCard, PageTitle, TabStyle, NFTStatus, NFTName, NFTOwner, Label, StatusValue, Price, ButtonWrapper, SubTitle, Content } from './style';

import ActionButton from '../../components/ActionButton';
import { AuctionViewState, useAuctions, useBidsForAuction, useUserBalance } from '../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection, useMeta, useUserAccounts, VaultState, Wallet } from '@oyster/common';
import { eligibleForParticipationPrizeGivenWinningIndex, sendRedeemBid } from '../../actions/sendRedeemBid';
import { sendCancelBid } from '../../actions/cancelBid';
const { TabPane } = Tabs;

const ActivityView = () => {
  const wallet = useWallet();
  const connection = useConnection();
  const {vaults, isLoadingMetaplex, bidRedemptions, prizeTrackingTickets} = useMeta();
  const { accountByMint } = useUserAccounts();

  const allAuctions = [
    ...useAuctions(AuctionViewState.Live),
    ...useAuctions(AuctionViewState.Ended),
    ...useAuctions(AuctionViewState.Upcoming),
    ...useAuctions(AuctionViewState.BuyNow),
  ];
  //NOTE: blm ketemu buat filter yg blm settle 
  const allOnSale = allAuctions.filter(v => v.auctionManager.authority === wallet.publicKey?.toBase58())

  // NOTE: buat nentuin sudah pernah redeem atau blm cek -> m.vault.info.tokenTypeCount > 0
  // besok rencananya kucobain semua scenario, buat mastiin udah fix atau blm
  const activeBids = allAuctions
  .filter(
    (m, idx) =>
      (m.myBidderMetadata?.info.bidderPubkey == wallet.publicKey?.toBase58()) && (m.vault.info.state != VaultState.Deactivated || m.vault.info.tokenTypeCount > 0),
  );

  if (!activeBids[0]) {
    return (
      <>
      </>
      ); 
  }
  const auctionView = activeBids[0]
  const bids = useBidsForAuction(auctionView.auction.pubkey);

  let winnerIndex: number | null = null;
  if (auctionView.myBidderPot?.pubkey)
    winnerIndex = auctionView.auction.info.bidState.getWinnerIndex(
      auctionView.myBidderPot?.info.bidderAct,
    );
    const eligibleForOpenEdition = eligibleForParticipationPrizeGivenWinningIndex(
      winnerIndex,
      auctionView,
      auctionView.myBidderMetadata,
      auctionView.myBidRedemption,
    );
  const mintKey = auctionView.auction.info.tokenMint;
  const balance = useUserBalance(mintKey);
  const myPayingAccount = balance.accounts[0];
  const eligibleForAnything = winnerIndex !== null || eligibleForOpenEdition;
  const isAuctionManagerAuthorityNotWalletOwner =
    auctionView.auctionManager.authority !== wallet?.publicKey?.toBase58();

  const onSale = allAuctions
  .filter(
    (m, idx) =>
    m.vault.info.authority === wallet.publicKey?.toBase58() &&
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
            <Button
              type="primary"
              size="large"
              className="action-btn"
              disabled={
                !myPayingAccount ||
                (!activeBids[0].myBidderMetadata &&
                  isAuctionManagerAuthorityNotWalletOwner) ||
                !!auctionView.items.find(i => i.find(it => !it.metadata))
              }
              onClick={async () => {
                // setShowRedemptionIssue(false);
                try {
                  if (eligibleForAnything) {
                    await sendRedeemBid(
                      connection,
                      wallet,
                      myPayingAccount.pubkey,
                      auctionView,
                      accountByMint,
                      prizeTrackingTickets,
                      bidRedemptions,
                      bids,
                    ).then(() => {
                      // setShowRedeemedBidModal(true)
                      // TODO ADD FLAG TO DB
                      // supabase.from('action_bidding')
                      // .update({is_redeem:true,})
                      // .eq('id', `${auctionView.auction.pubkey}_${myPayingAccount.pubkey}`);
                      
                    });
                  } else {
                    await sendCancelBid(
                      connection,
                      wallet,
                      myPayingAccount.pubkey,
                      auctionView,
                      accountByMint,
                      bids,
                      bidRedemptions,
                      prizeTrackingTickets,
                    );
                  }
                } catch (e) {
                  console.error(e);
                  // setShowRedemptionIssue(true);
                }
              }}
              style={{ marginTop: 20 }}
            >
              {activeBids[0].items.find(i => i.find(it => !it.metadata)) ||
              !myPayingAccount ? (
                <Spin />
              ) : eligibleForAnything ? (
                `Redeem bid`
              ) : (
                `${
                  wallet.publicKey &&
                  activeBids[0].auctionManager.authority ===
                  wallet.publicKey?.toBase58()
                    ? 'Reclaim Items'
                    : 'Refund bid'
                }`
              )}
            </Button>
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
