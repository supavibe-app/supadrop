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
  const { isLoadingMetaplex, isLoadingDatabase, liveDataAuctions } = useMeta();
  const now = Math.floor(new Date().getTime()/1000)
   
  const liveAuctions = Object.entries(liveDataAuctions).filter(([key, data]) => {
    if(data.endAt > now) return true
    return false
  })
  const endAuctions = Object.entries(liveDataAuctions).filter(([key, data]) => {
    if(data.endAt < now) return true
    return false
  })

  

  const auctionList = list => {
    if (isLoadingMetaplex && isLoadingDatabase) return [...Array(8)].map((_, idx) => <Col key={idx} span={6}><CardLoader key={idx} /></Col>)

    return (
      <>
        {list.map(([key,m], idx) => {

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
          {!Boolean(liveAuctions.length) && !isLoadingMetaplex && emptyAuction}
        </TabPane>

        <TabPane key="2" tab={(
          <div className={TitleWrapper}>ended auctions</div>
        )}>
          <Row gutter={[24, 24]}>{auctionList(endAuctions)}</Row>
          {!Boolean(endAuctions.length) && !isLoadingMetaplex && emptyAuction}
        </TabPane>
      </Tabs>
    </Col >
  );
};

export default AuctionListView;
