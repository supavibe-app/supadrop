import React from 'react';
import ReactGA from 'react-ga';
import { Row, Col, Button } from 'antd';
import { Description, MobileDescription } from './style';
import { ButtonStyle, GradientText, MobileButtonStyle } from '../Header/style';

const GetEarlyAccess = () => {
  return (
    <Row justify="center">
      <Col style={{ textAlign: 'center' }}>
        <div style={{ overflowX: 'auto' }}>
          <img src="/artworks.png" style={{ marginBottom: 66 }} />
        </div>
        <div className={Description}>calling for all artists and creators – it’s your turn</div>
        <Button className={ButtonStyle} style={{ marginBottom: 128 }} href="https://forms.gle/Wxotbnjj9j5mPdBaA" target="_blank" onClick={() => {
          ReactGA.event({
            category: 'Apply as Creator Selected',
            action: 'applyCreator',
            label: 'footer'
          });
        }}>
          <div>
            <span style={{ marginRight: 8 }}>APPLY AS CREATOR</span>
            <span className={GradientText}>//</span>
          </div>
        </Button>
      </Col>
    </Row>
  );
};

export const MobileGetEarlyAccess = () => {
  return (
    <Row justify="center">
      <Col span={24}>
        <div style={{ overflowX: 'auto', padding: '0 32px' }}>
          <img src="/artworks.png" style={{ marginBottom: 48 }} />
        </div>
      </Col>

      <Col span={20} style={{ textAlign: 'center' }}>
        <div className={MobileDescription}>calling for all artists and creators – it’s your turn</div>
        <Button className={MobileButtonStyle} style={{ marginBottom: 52 }} href="https://forms.gle/Wxotbnjj9j5mPdBaA" target="_blank" onClick={() => {
          ReactGA.event({
            category: 'Apply as Creator Selected',
            action: 'applyCreator',
            label: 'footer'
          });
        }}>
          <div>
            <span style={{ marginRight: 8 }}>APPLY AS CREATOR</span>
            <span className={GradientText}>//</span>
          </div>
        </Button>
      </Col>
    </Row>
  );
};

export default GetEarlyAccess;
