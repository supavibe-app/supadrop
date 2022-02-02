import React from 'react';
import { Col, Row, List } from 'antd';
import { BenefitDescription, BenefitTitle, DescriptionStyle, GradientText, ListStyle, MobileBenefitDescription, MobileBenefitTitle, MobileDescriptionStyle, MobileTitleSectionStyle, MobileTitleStyle, TitleSectionStyle, TitleStyle, VideoContainer } from './style';
import { uTextAlignCenter } from '../../../../styles';

const benefits = [
  {
    key: 'platform_fee',
    title: '0% platform fee',
    description: 'no supadrop seller fee on both primary and secondary market.',
  },
  {
    key: 'early_access',
    title: 'early access',
    description: 'early access to new features and exclusive events',
  },
  {
    key: 'vip_support',
    title: 'vip support',
    description: 'alpha members will have a team to receive vip support',
  },
  {
    key: 'exclusive_access',
    title: 'exclusive access',
    description: 'access to private group of selected artists for alpha members',
  },
  {
    key: 'special_badge',
    title: 'special badge',
    description: 'special discord & marketplace badge displayed on the user’s profile.',
  },
  {
    key: 'vote_rights',
    title: 'vote rights',
    description: 'vote new artists & collectors highlight, featured drops, vote to new platform features, strategic decisions, etc.',
  },
  {
    key: 'nft_airdrops',
    title: 'nft airdrops',
    description: 'future airdrops to rewards and honor our community of collectors & creators.',
  },
  {
    key: 'future_benefits',
    title: 'future benefits ++',
    description: 'wait for tons of future surprises, rewards and earning potential',
  },
];

const Benefits = () => {
  return (
    <Row justify="center">
      <Col span={11}>
        <div className={TitleSectionStyle}>
          <span style={{ marginRight: 8 }}>Benefits</span>
          <span className={GradientText}>//</span>
        </div>

        <div className={TitleStyle}>For Investing in Culture</div>

        <div className={DescriptionStyle}>SUPADROP Alpha membership is 500 Community members of private digital art collectors and creators group that offers NFT membership with rewards and a set list of benefits on SUPADROP Ecosystem.</div>

        <List
          className={ListStyle}
          size="large"
          bordered={false}
          dataSource={benefits}
          renderItem={item => (
            <List.Item key={item.key}>
              <Col className={BenefitTitle} span={12}>
                {item.title}
              </Col>

              <Col className={BenefitDescription} span={12}>
                {item.description}
              </Col>
            </List.Item>
          )}
        />
      </Col>

      <Col className={uTextAlignCenter} span={11}>
        <video className={VideoContainer} width="75%" autoPlay muted loop style={{ marginLeft: 64 }}>
          <source src="video/supadrop_ticket.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Col>
    </Row>
  );
};

export const MobileBenefits = () => {
  return (
    <Row justify="center">
      <Col className={uTextAlignCenter} span={20}>
        <video className={VideoContainer} width="100%" autoPlay muted loop style={{ marginBottom: 48 }}>
          <source src="video/supadrop_ticket.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Col>

      <Col span={20}>
        <div className={MobileTitleSectionStyle}>
          <span style={{ marginRight: 8 }}>Benefits</span>
          <span className={GradientText}>//</span>
        </div>

        <div className={MobileTitleStyle}>For Investing in Culture</div>

        <div className={MobileDescriptionStyle}>SUPADROP Alpha membership is 500 Community members of private digital art collectors and creators group that offers NFT membership with rewards and a set list of benefits on SUPADROP Ecosystem.</div>

        <List
          className={ListStyle}
          size="large"
          bordered={false}
          dataSource={benefits}
          renderItem={item => (
            <List.Item key={item.key}>
              <Col className={MobileBenefitTitle} span={24}>
                {item.title}
              </Col>

              <Col className={MobileBenefitDescription} span={24}>
                {item.description}
              </Col>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default Benefits;