import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { Row, Card, Col, Tabs, Image, Avatar, Statistic } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { BidPrice, CardStyle, ImagePreview, MobileDescription, MobileSubHeaderBox, MobileTabsStyle, OwnerContainer, PreviewStyle, ProfileInfo, SubHeaderBox, TabsStyle, UserWrapper, PreviewCarousel, PreviewRow } from './style';
import { GreyColor, uFlexJustifyCenter, uTextAlignEnd, YellowGlowColor } from '../../../styles';

const { TabPane } = Tabs;
const { Meta } = Card;

const TabsContent =
{
  '1': {
    Title: 'CREATE',
    Content: 'supadrop helps you to start creating & sell your NFT in few simple steps.',
  },
  '2': {
    Title: 'SHARE',
    Content: 'customize your profile to show off your art collection to patrons around the world in any format.',
  },
  '3': {
    Title: 'COLLECT',
    Content: 'purchase at the asking price or make an offer by placing a bid. Once you own a piece you can sell it on the secondary market to other collectors.',
  },
};

const SubHeader = () => {
  const [activeKey, setActiveKey] = useState('1');

  const handleChangeTab = key => {
    setActiveKey(key);

    switch (key) {
      case '1':
        ReactGA.event({
          category: 'Tab Button Selected',
          action: 'tabButton',
          label: 'create'
        });
        break;
      case '2':
        ReactGA.event({
          category: 'Tab Button Selected',
          action: 'tabButton',
          label: 'share'
        });
        break;
      case '3':
        ReactGA.event({
          category: 'Tab Button Selected',
          action: 'tabButton',
          label: 'collect'
        });
        break;
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 96 }}>
      <Col className={SubHeaderBox} span={22}>
        <Tabs
          className={TabsStyle}
          onChange={handleChangeTab}
          defaultActiveKey="1"
          tabPosition="left"
          tabBarExtraContent={{
            right: TabsContent[activeKey].Content,
          }}
        >
          <TabPane
            key="1"
            tab={(
              <>
                {activeKey === '1' && <div className="tab-indicator" />}
                <div>{TabsContent['1'].Title}</div>
              </>
            )}
          >
            <Image className={ImagePreview} src="/img/preview-create.png" preview={false} />
          </TabPane>

          <TabPane
            key="2"
            tab={(
              <>
                {activeKey === '2' && <div className="tab-indicator" />}
                <div>{TabsContent['2'].Title}</div>
              </>
            )}
          >
            <Image className={ImagePreview} src="/img/preview-share.png" preview={false} />
          </TabPane>

          <TabPane
            key="3"
            tab={(
              <>
                {activeKey === '3' && <div className="tab-indicator" />}
                <div>{TabsContent['3'].Title}</div>
              </>
            )}
          >
            <Image className={ImagePreview} src="/img/preview-collect.png" preview={false} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

const MobilePreview = () => {
  return (
    <div className={PreviewStyle}>
      <Avatar src="/img/profile/exnd.png" size={72} style={{ marginBottom: 16 }} />

      <div className={ProfileInfo}>ExnD</div>

      <div className={`${ProfileInfo} ${GreyColor}`}>
        <span style={{ marginRight: 8 }}>4fbF...HDvG</span>
        <FeatherIcon icon="copy" size={14} />
      </div>

      <div className={`${YellowGlowColor} ${ProfileInfo}`}>@exnd</div>

      <div className={uFlexJustifyCenter}>
        <img src="/img/logo/twitter.svg" width="18" style={{ margin: '0 4px' }} />

        <span style={{ margin: '0 4px' }}>
          <FeatherIcon icon="globe" size={18} />
        </span>
      </div>

      <div className={PreviewCarousel}>
        <Row wrap={false} className={PreviewRow} gutter={[20, 20]}>
          <Col>
            <Card
              className={CardStyle}
              cover={
                <div>
                  <Image src="/img/preview/1.png" preview={false} height={175} width={175} />
                </div>
              }
            >
              <Meta
                title="floating temple"
                description={
                  <>
                    <div className={UserWrapper}>
                      <Avatar src="/img/profile/exnd.png" size={32} style={{ marginRight: 12 }} />
                      <span>@exnd</span>
                    </div>

                    <Row>
                      <Col span={12}>
                        <div>sold for</div>

                        <Statistic className={BidPrice} value="120" suffix="SOL" />
                      </Col>

                      <Col className={uTextAlignEnd} span={12}>
                        <div>
                          <div>owner</div>
                        </div>

                        <div className={OwnerContainer}>
                          @apri
                        </div>
                      </Col>
                    </Row>
                  </>
                }
              />
            </Card>
          </Col>

          <Col>
            <Card
              hoverable={true}
              className={CardStyle}
              cover={
                <div>
                  <Image src="/img/preview/2.png" preview={false} height={175} width={175} />
                </div>
              }
            >
              <Meta
                title="unknown island"
                description={
                  <>
                    <div className={UserWrapper}>
                      <Avatar src="/img/profile/exnd.png" size={32} style={{ marginRight: 12 }} />
                      <span>@exnd</span>
                    </div>

                    <Row>
                      <Col span={12}>
                        <div>sold for</div>

                        <Statistic className={BidPrice} value="81" suffix="SOL" />
                      </Col>

                      <Col className={uTextAlignEnd} span={12}>
                        <div>
                          <div>owner</div>
                        </div>

                        <div className={OwnerContainer}>
                          @raihaniyai
                        </div>
                      </Col>
                    </Row>
                  </>
                }
              />
            </Card>
          </Col>

          <Col>
            <Card
              hoverable={true}
              className={CardStyle}
              cover={
                <div>
                  <Image src="/img/preview/3.png" preview={false} height={175} width={175} />
                </div>
              }
            >
              <Meta
                title="render.006"
                description={
                  <>
                    <div className={UserWrapper}>
                      <Avatar src="/img/profile/exnd.png" size={32} style={{ marginRight: 12 }} />
                      <span>@exnd</span>
                    </div>

                    <Row>
                      <Col span={12}>
                        <div>sold for</div>

                        <Statistic className={BidPrice} value="140" suffix="SOL" />
                      </Col>

                      <Col className={uTextAlignEnd} span={12}>
                        <div>
                          <div>owner</div>
                        </div>

                        <div className={OwnerContainer}>
                          @nmluthfi
                        </div>
                      </Col>
                    </Row>
                  </>
                }
              />
            </Card>
          </Col>
        </Row>

      </div>
    </div>
  );
};

export const MobileSubHeader = () => {
  const [activeKey, setActiveKey] = useState('1');

  const handleChangeTab = key => {
    setActiveKey(key);

    switch (key) {
      case '1':
        ReactGA.event({
          category: 'Tab Button Selected',
          action: 'tabButton',
          label: 'create'
        });
        break;
      case '2':
        ReactGA.event({
          category: 'Tab Button Selected',
          action: 'tabButton',
          label: 'share'
        });
        break;
      case '3':
        ReactGA.event({
          category: 'Tab Button Selected',
          action: 'tabButton',
          label: 'collect'
        });
        break;
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 48 }}>
      <Col className={MobileSubHeaderBox} span={20}>
        <Tabs
          className={MobileTabsStyle}
          onChange={handleChangeTab}
          defaultActiveKey="1"
          tabPosition="top"
          tabBarGutter={24}
        >
          <TabPane
            key="1"
            tab={(
              <>
                {activeKey === '1' && <div className="tab-indicator" />}
                <div>{TabsContent['1'].Title}</div>
              </>
            )}
          >
            <div className={MobileDescription}>{TabsContent['1'].Content}</div>
            <MobilePreview />
          </TabPane>

          <TabPane
            key="2"
            tab={(
              <>
                {activeKey === '2' && <div className="tab-indicator" />}
                <div>{TabsContent['2'].Title}</div>
              </>
            )}
          >
            <div className={MobileDescription}>{TabsContent['2'].Content}</div>
            <MobilePreview />
          </TabPane>

          <TabPane
            key="3"
            tab={(
              <>
                {activeKey === '3' && <div className="tab-indicator" />}
                <div>{TabsContent['3'].Title}</div>
              </>
            )}
          >
            <div className={MobileDescription}>{TabsContent['3'].Content}</div>
            <MobilePreview />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default SubHeader;