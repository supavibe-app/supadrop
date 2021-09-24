import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row } from 'antd';
import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuctionRenderCard, AuctionRenderCard2 } from '../../components/AuctionRenderCard';
import { CardLoader } from '../../components/MyLoader';
import { useMeta } from '../../contexts';
import { AuctionView, AuctionViewState, useAuctions } from '../../hooks';
import { LiveDot, TitleWrapper } from './style';
const { Content } = Layout;

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

export const AuctionListView = () => {
  const auctions = useAuctions(AuctionViewState.Live);
  const auctionsEnded = useAuctions(AuctionViewState.Ended);
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const { isLoading , liveDataAuctions} = useMeta();
  const { connected, publicKey } = useWallet();
  
  // Check if the auction is primary sale or not
  const checkPrimarySale = (auc: AuctionView) => {
    var flag = 0;
    auc.items.forEach(i => {
      i.forEach(j => {
        if (j.metadata.info.primarySaleHappened == true) {
          flag = 1;
          return true;
        }
      });
      if (flag == 1) return true;
    });
    if (flag == 1) return true;
    else return false;
  };

  const resaleAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(m => checkPrimarySale(m) == true);

  // Removed resales from live auctions
  const liveAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(a => !resaleAuctions.includes(a));

  let items = liveAuctions;

  switch (activeKey) {
    case LiveAuctionViewState.All:
      items = liveAuctions;
      break;
    case LiveAuctionViewState.Participated:
      items = liveAuctions
        .concat(auctionsEnded)
        .filter(
          (m, idx) =>
            m.myBidderMetadata?.info.bidderPubkey == publicKey?.toBase58(),
        );
      break;
    case LiveAuctionViewState.Resale:
      items = resaleAuctions;
      break;
    case LiveAuctionViewState.Ended:
      items = auctionsEnded;
      break;
  }

  

  const heroAuction = useMemo(
    () =>
      auctions.filter(a => {
        // const now = moment().unix();
        return !a.auction.info.ended() && !resaleAuctions.includes(a);
        // filter out auction for banner that are further than 30 days in the future
        // return Math.floor(delta / 86400) <= 30;
      })?.[0],
    [auctions],
  );

  const liveAuctionsView = (
    <>
      {!isLoading
        ? Object.entries(liveDataAuctions).map(([id,m], idx) => {
          return (
            <Link to={`/auction/${id}`} key={idx}>
              <AuctionRenderCard2 key={id} auctionView={m} />
            </Link>
          );
        })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </>
  );

  const endedAuctions = (
    <>
      {!isLoading
        ? auctionsEnded.map((m, idx) => {
          if (m === heroAuction) return;

          const id = m.auction.pubkey;
          return (
            <Col key={idx} span={6}>
              <Link to={`/auction/${id}`}>
                <AuctionRenderCard auctionView={m} />
              </Link>
            </Col>
          );
        })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </>
  );

  return (
    <Col style={{ margin: '62px 54px' }}>
      <div className={TitleWrapper}>
        <div className={LiveDot} />live auctions
      </div>

      {liveAuctions.length >= 0 && <Row gutter={[24, 24]}>{liveAuctionsView}</Row>}
    </Col>
  );
};