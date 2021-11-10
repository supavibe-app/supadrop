import React from 'react';
import ReactGA from 'react-ga';
import { Row, Col, Divider } from 'antd';

import HeaderSection, { MobileHeaderSection } from '../../components/LandingPage/Header';
import SubHeader, { MobileSubHeader } from '../../components/LandingPage/SubHeader';
import MarqueeText, { MobileMarqueeText } from '../../components/LandingPage/MarqueeText';
import Features, { MobileFeatures } from '../../components/LandingPage/Features';
import GetEarlyAccess, { MobileGetEarlyAccess } from '../../components/LandingPage/GetEarlyAccess';
import Initiatives, { MobileInitiatives } from '../../components/LandingPage/Initiatives';
import Footer, { MobileFooter } from '../../components/LandingPage/Footer';
import NFTDrop, { MobileNFTDrop } from '../../components/LandingPage/NFTDrop';

const LandingPage = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);

  return (
    <Row justify="center">
      {/* Desktop */}
      <Col xs={0} sm={24}>
        <DesktopLandingPage />
      </Col>

      {/* Mobile */}
      <Col xs={24} sm={0}>
        <MobileLandingPage />
      </Col>
    </Row>
  )
}

const DesktopLandingPage = () => {
  return (
    <>
      <HeaderSection />
      <SubHeader />

      <MarqueeText text="FEATURES" />

      <Features />
      <Initiatives />

      <MarqueeText text="NFT DROP" />

      <NFTDrop />

      <MarqueeText text="GET EARLY ACCESS" />

      <GetEarlyAccess />

      <Row justify="center">
        <Col span={22}>
          <Divider />
        </Col>
      </Row>

      <Footer />
    </>
  );
};

const MobileLandingPage = () => {
  return (
    <>
      <MobileHeaderSection />
      <MobileSubHeader />

      <MobileMarqueeText text="FEATURES" />

      <MobileFeatures />
      <MobileInitiatives />

      <MobileMarqueeText text="NFT DROP" />

      <MobileNFTDrop />

      <MobileMarqueeText text="GET EARLY ACCESS" />

      <MobileGetEarlyAccess />

      <Row justify="center">
        <Col span={20}>
          <Divider />
        </Col>
      </Row>

      <MobileFooter />
    </>
  );
};

export default LandingPage;
