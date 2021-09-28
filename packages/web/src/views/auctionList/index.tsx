import React, { useMemo, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import BN from 'bn.js';
import { Link } from 'react-router-dom';
import { AuctionRenderCard2 } from '../../components/AuctionRenderCard';
import { CardLoader } from '../../components/MyLoader';
import { useMeta } from '../../contexts';
import { AuctionView, AuctionViewState, useAuctions } from '../../hooks';
import { Label, LiveDot, NumberStyle, TabsStyle, Timer, TitleWrapper } from './style';
import ActionButton from '../../components/ActionButton';

const { TabPane } = Tabs;

const AuctionListView = () => {
  const auctions = useAuctions(AuctionViewState.Live);
  const auctionsEnded = useAuctions(AuctionViewState.Ended);
  const [activeKey, setActiveKey] = useState(auctions.length > 0 ? '1' : '2');
  const { isLoading, liveDataAuctions } = useMeta();

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
  // const liveAuctions = auctions
  //   .sort(
  //     (a, b) =>
  //       a.auction.info.endedAt
  //         ?.sub(b.auction.info.endedAt || new BN(0))
  //         .toNumber() || 0,
  //   )
  //   .filter(a => !resaleAuctions.includes(a));

  const liveAuctions = Object.entries(liveDataAuctions).map(([key, data]) => {
    return data;
  })

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

  const auctionList = list => {
    if (isLoading) return [...Array(8)].map((_, idx) => <Col key={idx} span={6}><CardLoader key={idx} /></Col>)

    return (
      <>
        {list.map((m, idx) => {
          // console.log('auctionList',list)
          // console.log('mapAuction',m)
          // console.log('idxAuction',idx)
          // console.log('heroAuction',heroAuction)

          // if (m === heroAuction) return;

          // const id = m.auction.pubkey;
          return (
            <Col key={idx} span={6}>
              <Link to={`/auction/${m.id}`}>
                <AuctionRenderCard2 auctionView={m} />
              </Link>
            </Col>
          );
        })}
      </>
    )
  };

  const emptyAuction = (
    <div style={{ marginLeft: 28 }}>
      <div className={Timer}>
        starting in
      </div>

      <Row gutter={[24, 0]} style={{ marginBottom: 48 }}>
        <Col>
          <div className={NumberStyle}>00
          </div>
          <div className={Label}>days</div>
        </Col>

        <Col>
          <div className={NumberStyle}>00
          </div>
          <div className={Label}>hours</div>
        </Col>

        <Col>
          <div className={NumberStyle}>00
          </div>
          <div className={Label}>minutes</div>
        </Col>
        <Col>
          <div className={NumberStyle}>00
          </div>
          <div className={Label}>seconds</div>
        </Col>
      </Row>

      <ActionButton to={"/testing"}>notify me</ActionButton>
    </div>
  );

  return (
    <Col style={{ margin: '62px 54px' }}>
      <Tabs defaultActiveKey={liveAuctions.length > 0 ? '1' : '2'} className={TabsStyle} onChange={key => setActiveKey(key)}>
        <TabPane key="1" tab={(<div className={TitleWrapper}>
          <div className={LiveDot(activeKey === '1')} />live auctions
        </div>)}>
          <Row gutter={[24, 24]}>{auctionList(liveAuctions)}</Row>
          {!Boolean(liveAuctions.length) && !isLoading && emptyAuction}
        </TabPane>

        <TabPane key="2" tab={(
          <div className={TitleWrapper}>ended auctions</div>
        )}>
          <Row gutter={[24, 24]}>{auctionList(auctionsEnded)}</Row>
          {!Boolean(auctionsEnded.length) && !isLoading && emptyAuction}
        </TabPane>
      </Tabs>
    </Col >
  );
};

export default AuctionListView;
