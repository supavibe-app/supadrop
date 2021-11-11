import React from 'react';
import ReactGA from 'react-ga';
import { Row, Col } from 'antd';
import FeatherIcons from 'feather-icons-react';
import { FeatureBox, MobileFeatureBox, MobilePoweredDescription, MobilePoweredImagesContainer, PoweredDescription, PoweredImagesContainer, WhiteFont14, WhiteFont24 } from './style';

const features = [
  {
    key: 'royalties',
    icon: 'percent',
    text: 'Royalties',
  },
  {
    key: 'auctions',
    icon: 'tag',
    text: 'Auctions',
  },
  {
    key: 'instant sales',
    icon: 'zap',
    text: 'Instant Sales',
  },
  {
    key: 'creators split',
    icon: 'pie-chart',
    text: 'Creators Split',
  },
  {
    key: 'manymore',
    icon: 'grid',
    text: 'many more ++',
  },
];

const Features = () => {
  return (
    <Row justify="center">
      <Col span={22}>
        <div className={WhiteFont24}>POWERED BY</div>

        <div className={PoweredImagesContainer}>
          <img src="metaplex.png" alt="metaplex" />
          <img src="solana.png" alt="solana" />
        </div>

        <div className={PoweredDescription}>powered by metaplex, supadrop will help you create the best experience launching your NFT drop on solana</div>

        <Row justify="start">
          {features.map((feature, index) => (
            <Col className={FeatureBox(index === features.length - 1)} key={feature.key}>
              <div onClick={() => {
                ReactGA.event({
                  category: 'Feature Button Selected',
                  action: 'featureButton',
                  label: feature.key,
                });
              }}>
                <FeatherIcons icon={feature.icon} size={48} />
                <div>{feature.text}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export const MobileFeatures = () => {
  return (
    <Row justify="center">
      <Col span={20}>
        <div className={WhiteFont14}>POWERED BY</div>

        <div className={MobilePoweredImagesContainer}>
          <img src="metaplex.png" alt="metaplex" height="12" />
          <img src="solana.png" alt="solana" height="14" />
        </div>

        <div className={MobilePoweredDescription}>powered by metaplex, supadrop will help you create the best experience launching your NFT drop on solana</div>

        <Row justify="start" style={{ paddingLeft: 10 }}>
          {features.map((feature, index) => (
            <Col className={MobileFeatureBox(index === features.length - 1)} key={feature.key}>
              <div onClick={() => {
                ReactGA.event({
                  category: 'Feature Button Selected',
                  action: 'featureButton',
                  label: feature.key,
                });
              }}>
                <FeatherIcons icon={feature.icon} size={28} />
                <div>{feature.text}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};


export default Features;
