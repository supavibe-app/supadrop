import React, { useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AuctionRenderCard2 } from '../../components/AuctionRenderCard';
import { CardLoader } from '../../components/MyLoader';
import { useMeta } from '../../contexts';
import { AuctionViewState, useAuctions } from '../../hooks';
import ActionButton from '../../components/ActionButton';
import { Label, LiveDot, NumberStyle, TabsStyle, Timer, TitleWrapper } from './style';
import { TwitterURL } from '../../constants';
import { getUsernameByPublicKeys } from '../../database/userData';

const { TabPane } = Tabs;

const AuctionListView = () => {
  const auctionsEnded = useAuctions(AuctionViewState.Ended);
  const { isLoadingMetaplex, isLoadingDatabase, liveDataAuctions } = useMeta();
  const now = moment().unix();

  const liveAuctions = Object.values(liveDataAuctions).filter((data) => data.endAt > now);
  const endAuctions = Object.values(liveDataAuctions).filter((data) => data.endAt < now);

  const [activeKey, setActiveKey] = useState(liveAuctions.length > 0 ? '1' : '2');

  useEffect(() => {
    if (liveAuctions.length) setActiveKey('1');
    else setActiveKey('2');
  }, [liveDataAuctions]);

  const auctionList = list => {
    if (isLoadingMetaplex && isLoadingDatabase) return [...Array(8)].map((_, idx) => <Col key={idx} span={24} xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}><CardLoader key={idx} /></Col>)

    const ownerAddress = list.map(auction => auction.owner);
    const { data = {} } = getUsernameByPublicKeys(ownerAddress);

    return list.map((m, idx) => {
      const defaultOwnerData = { wallet_address: m.owner, img_profile: null };

      return (
        <Col key={idx} span={24} xxl={8} xl={8} lg={8} md={12} sm={24} xs={24}>
          <Link to={`/auction/${m.id}`}>
            <AuctionRenderCard2 auctionView={m} owner={data[m.owner] || defaultOwnerData} />
          </Link>
        </Col>
      );
    });
  };

  const emptyAuction = (
    <div style={{ margin: '0 0 48px 28px' }}>
      <div className={Timer}>
        starting in
      </div>

      {/* TODO-Iyai: implement countdown */}
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


      <a href={TwitterURL}>
        <ActionButton size="large">notify me</ActionButton>
      </a>
    </div>
  );

  return (
    <Row justify="center">
      <Col style={{ margin: '24px 0 48px 0' }} span={20} xs={20} sm={20} md={20} lg={20} xl={18} xxl={16}>
        <Tabs activeKey={activeKey} className={TabsStyle} onChange={key => setActiveKey(key)}>
          <TabPane key="1" tab={(
            <div className={TitleWrapper}>
              <div className={LiveDot(activeKey === '1')} />live auctions
            </div>
          )}>
            <Row gutter={[36, 36]}>{auctionList(liveAuctions)}</Row>
            {!Boolean(liveAuctions.length) && !isLoadingMetaplex && emptyAuction}
          </TabPane>

          <TabPane key="2" tab={(
            <div className={TitleWrapper}>ended auctions</div>
          )}>
            <Row gutter={[36, 36]}>{auctionList(endAuctions)}</Row>
            {!Boolean(auctionsEnded.length) && !isLoadingMetaplex && emptyAuction}
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default AuctionListView;
