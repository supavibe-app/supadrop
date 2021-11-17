import React, { useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AuctionRenderCard2 } from '../../components/AuctionRenderCard';
import { CardLoader } from '../../components/MyLoader';
import { useMeta } from '../../contexts';
import { AuctionViewState, useAuctions } from '../../hooks';
import ActionButton from '../../components/ActionButton';
import {
  Label,
  LiveDot,
  NumberStyle,
  TabsStyle,
  Timer,
  TitleWrapper,
} from './style';
import { TwitterURL } from '../../constants';
import { getUsernameByPublicKeys } from '../../database/userData';
import countDown from '../../helpers/countdown';
import { CountdownState } from '@oyster/common';

const { TabPane } = Tabs;

const AuctionListView = () => {
  const [state, setState] = useState<CountdownState>();
  const auctionsEnded = useAuctions(AuctionViewState.Ended);
  const {
    isLoadingMetaplex,
    isLoadingDatabase,
    liveDataAuctions,
    allDataAuctions,
    endingTime,
    dataCollection,
  } = useMeta();
  const now = moment().unix();

  const [activeKey, setActiveKey] = useState(
    Object.entries(liveDataAuctions).length > 0 ? '1' : '2',
  );

  useEffect(() => {
    const calc = () => setState(countDown(endingTime ? endingTime : dataCollection.start_publish));
    const interval = setInterval(() => calc(), 1000);
    calc();

    return () => clearInterval(interval);
  }, [endingTime, dataCollection]);

  useEffect(() => {
    if (Object.entries(liveDataAuctions).length) setActiveKey('1');
    else setActiveKey('2');
  }, [liveDataAuctions]);

  const liveAuctions = Object.entries(liveDataAuctions).filter(
    ([key, data]) => data.endAt > now,
  );

  const endAuctions = Object.entries(allDataAuctions)
    .filter(([key, data]) => data.endAt < now && !data.isInstantSale)
    .reverse();

  const auctionList = list => {
    if (isLoadingMetaplex && isLoadingDatabase)
      return [...Array(8)].map((_, idx) => (
        <Col key={idx} span={24} xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
          <CardLoader key={idx} />
        </Col>
      ));

    const ownerAddress = list.map(([id, m]) => m.owner);
    const { data = {} } = getUsernameByPublicKeys(ownerAddress);

    return list.map(([id, m], idx) => {
      const defaultOwnerData = { wallet_address: m.owner, img_profile: null };

      return (
        <Col key={idx} span={24} xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
          <Link to={`/auction/${m.id}`}>
            <AuctionRenderCard2
              auctionView={m}
              owner={data[m.owner] || defaultOwnerData}
            />
          </Link>
        </Col>
      );
    });
  };

  const emptyAuction = (
    <div style={{ margin: '0 0 48px 28px' }}>
      <div className={Timer}>starting in</div>

      <Row gutter={[24, 0]} style={{ marginBottom: 48 }}>
        {state && (
          <>
            {state.days > 0 && (
              <Col>
                <div className={NumberStyle}>
                  {state.days < 10 && <span>0</span>}
                  {state.days}
                </div>
                <div className={Label}>days</div>
              </Col>
            )}

            <Col>
              <div className={NumberStyle}>
                {state.hours < 10 && <span>0</span>}
                {state.hours}
              </div>
              <div className={Label}>hours</div>
            </Col>

            <Col>
              <div className={NumberStyle}>
                {state.minutes < 10 && <span>0</span>}
                {state.minutes}
              </div>
              <div className={Label}>minutes</div>
            </Col>
            <Col>
              <div className={NumberStyle}>
                {state.seconds < 10 && <span style={{ opacity: 0.2 }}>0</span>}
                {state.seconds}
              </div>
              <div className={Label}>seconds</div>
            </Col>
          </>
        )}
      </Row>

      <a href={TwitterURL}>
        <ActionButton size="large">notify me</ActionButton>
      </a>
    </div>
  );

  return (
    <Row justify="center">
      <Col
        style={{ margin: '24px 0 48px 0' }}
        span={20}
        xs={20}
        sm={20}
        md={20}
        lg={20}
        xl={18}
        xxl={16}
      >
        <Tabs
          activeKey={activeKey}
          className={TabsStyle}
          onChange={key => setActiveKey(key)}
        >
          <TabPane
            key="1"
            tab={
              <div className={TitleWrapper}>
                <div className={LiveDot(activeKey === '1')} />
                live auctions
              </div>
            }
          >
            <Row gutter={[36, 36]}>{auctionList(liveAuctions)}</Row>
            {!Boolean(liveAuctions.length) &&
              !isLoadingMetaplex &&
              emptyAuction}
          </TabPane>

          <TabPane
            key="2"
            tab={<div className={TitleWrapper}>ended auctions</div>}
          >
            <Row gutter={[36, 36]}>{auctionList(endAuctions)}</Row>
            {!Boolean(auctionsEnded.length) &&
              !isLoadingMetaplex &&
              emptyAuction}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default AuctionListView;
