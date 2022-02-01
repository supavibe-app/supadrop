import React, { useRef } from 'react';
import ReactGA from 'react-ga';
import { Row, Col, Divider } from 'antd';

import HeaderSection, { MobileHeaderSection } from '../../components/LandingPage/Header';
import SubHeader, { MobileSubHeader } from '../../components/LandingPage/SubHeader';
import MarqueeText, { MobileMarqueeText } from '../../components/LandingPage/MarqueeText';
import Features, { MobileFeatures } from '../../components/LandingPage/Features';
import GetEarlyAccess, { MobileGetEarlyAccess } from '../../components/LandingPage/GetEarlyAccess';
import Initiatives, { MobileInitiatives } from '../../components/LandingPage/Initiatives';
import Footer, { MobileFooter } from '../../components/LandingPage/Footer';
// import NFTDrop, { MobileNFTDrop } from '../../components/LandingPage/NFTDrop';
import Benefits, { MobileBenefits } from '../../components/LandingPage/AlphaMembership/Benefits';
import SpecialWhitelist, { MobileSpecialWhitelist } from '../../components/LandingPage/AlphaMembership/SpecialWhitelist';
import AppBar, { MobileAppBar } from '../../components/LandingPage/AppBar';

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
  const refMembership = useRef() as React.MutableRefObject<HTMLInputElement>;
  const refWhitelist = useRef() as React.MutableRefObject<HTMLInputElement>;

  return (
    <>
      <AppBar refMembership={refMembership} refWhitelist={refWhitelist} />

      <HeaderSection />
      <SubHeader />

      <MarqueeText text="FEATURES" />

      <Features />
      <Initiatives />

      {/* <MarqueeText text="NFT DROP" />

      <NFTDrop /> */}

      <MarqueeText text="ALPHA MEMBERSHIP" refProp={refMembership} />

      {/* Benefits */}
      <Benefits />

      {/* SpecialWhitelist */}
      <SpecialWhitelist refMembership={refMembership} refWhitelist={refWhitelist} />

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
  const refMembership = useRef() as React.MutableRefObject<HTMLInputElement>;
  const refWhitelist = useRef() as React.MutableRefObject<HTMLInputElement>;

  return (
    <>
      <MobileAppBar refMembership={refMembership} refWhitelist={refWhitelist} />

      <MobileHeaderSection />
      <MobileSubHeader />

      <MobileMarqueeText text="FEATURES" />

      <MobileFeatures />
      <MobileInitiatives />

      {/* <MobileMarqueeText text="NFT DROP" />
      <MobileNFTDrop /> */}

      <MobileMarqueeText text="ALPHA MEMBERSHIP" refProp={refMembership} />
      <MobileBenefits />
      <MobileSpecialWhitelist refMembership={refMembership} refWhitelist={refWhitelist} />

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
