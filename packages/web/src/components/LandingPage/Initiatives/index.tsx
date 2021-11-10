import React from 'react';
import ReactGA from 'react-ga';
import { Button, Col, Divider, Row } from 'antd';
import { BackgroundImage, ButtonList, Description, DividerStyle, GradientText, MobileButtonList, MobileDescription, MobileTitle, Title } from './style';
import { WhiteColor } from '../../../styles';
import { ButtonStyle, MobileButtonStyle } from '../Header/style';

const initiatives = [
  'no code custom marketplace',
  'curated gallery',
  'curated drops',
  'launchpad',
  'portfolio tracker',
  'social following',
  'curation token',
  'publication tools',
  'airdrop calendar',
  'social verification',
  'derivatife projects pool',
  'creator invite program',
  'tagging system',
  'ranking system',
  'social tokens',
  'curation tools for curators',
  'collaboration gallery',
  'metaverse gallery',
  'and many more ++',
];

const Initiatives = () => {
  return (
    <Row justify="end">
      <img src="/initiativebg.png" className={BackgroundImage} width="480" />
      <Col span={23} style={{ marginTop: 236 }}>
        <div className={Title}>POTENTIAL INITIATIVES</div>
        <div className={Description}>
          <span className={WhiteColor}>
            <u>We don't want a fixed roadmap and overpromised you</u>
          </span>
          <span> but we prefer to adapt to what our creators or community needed. So, here is some ideas that we are planning to build in the future.</span>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 72 }}>
          {initiatives.map(initiative => (
            <Col key={initiative}>
              <Button className={ButtonList} shape="round" size="large" onClick={() => {
                ReactGA.event({
                  category: 'Tags Button Selected',
                  action: 'tagsButton',
                  label: initiative,
                });
              }}>{initiative}</Button>
            </Col>
          ))}
        </Row>

        <Divider className={DividerStyle} orientation="left">
          <Button className={ButtonStyle} href="https://discord.gg/xhXXeZ2ARA" target="_blanks">
            <div>
              <span style={{ marginRight: 8 }}>SUBMIT YOURS ON DISCORD</span>
              <span className={GradientText}>//</span>
            </div>
          </Button>
        </Divider>
      </Col>
    </Row >
  );
};

export const MobileInitiatives = () => {
  return (
    <Row justify="end">
      <img src="/initiativebg.png" className={BackgroundImage} width="132" />
      <Col span={22} offset={2} style={{ marginTop: 52 }}>
        <div className={MobileTitle}>POTENTIAL INITIATIVES</div>
        <div className={MobileDescription}>
          <span className={WhiteColor}>
            <u>We don't want a fixed roadmap and overpromised you</u>
          </span>
          <span> but we prefer to adapt to what our creators or community needed., here is some ideas that we are planning to build in the future.</span>
        </div>
      </Col>

      <Col span={24}>
        <div style={{ overflowY: 'auto', paddingLeft: 32 }}>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }} wrap={false}>
            {initiatives.slice(0, 4).map(initiative => (
              <Col key={initiative}>
                <Button className={MobileButtonList} shape="round" size="large" onClick={() => {
                  ReactGA.event({
                    category: 'Tags Button Selected',
                    action: 'tagsButton',
                    label: initiative,
                  });
                }}>{initiative}</Button>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }} wrap={false}>
            {initiatives.slice(5, 9).map(initiative => (
              <Col key={initiative}>
                <Button className={MobileButtonList} shape="round" size="large" onClick={() => {
                  ReactGA.event({
                    category: 'Tags Button Selected',
                    action: 'tagsButton',
                    label: initiative,
                  });
                }}>{initiative}</Button>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }} wrap={false}>
            {initiatives.slice(10, 14).map(initiative => (
              <Col key={initiative}>
                <Button className={MobileButtonList} shape="round" size="large" onClick={() => {
                  ReactGA.event({
                    category: 'Tags Button Selected',
                    action: 'tagsButton',
                    label: initiative,
                  });
                }}>{initiative}</Button>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 48 }} wrap={false}>
            {initiatives.slice(15).map(initiative => (
              <Col key={initiative}>
                <Button className={MobileButtonList} shape="round" size="large" onClick={() => {
                  ReactGA.event({
                    category: 'Tags Button Selected',
                    action: 'tagsButton',
                    label: initiative,
                  });
                }}>{initiative}</Button>
              </Col>
            ))}
          </Row>
        </div>
      </Col>

      <Col span={22} offset={2}>
        <Divider className={DividerStyle} orientation="left">
          <Button className={MobileButtonStyle} href="https://discord.gg/xhXXeZ2ARA" target="_blanks">
            <div>
              <span style={{ marginRight: 8 }}>SUBMIT YOURS ON DISCORD</span>
              <span className={GradientText}>//</span>
            </div>
          </Button>
        </Divider>
      </Col >
    </Row >
  );
};

export default Initiatives;
