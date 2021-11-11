import React from 'react';
import { Col, Row } from 'antd';
import ReactGA from 'react-ga';

const About = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);

  return (
    <Row justify="center">
      {/* DESKTOP */}
      <Col xs={0} sm={14} style={{ marginTop: 72 }}>
        <div style={{ fontSize: 56, color: '#FAFAFB', fontWeight: 'bold', marginBottom: 34 }}>OUR STORY</div>
        <p style={{ fontSize: 20, marginBottom: 120, color: '#7E7C7C' }}>
          We believe all the great things that shaped how we live today started from a personal project. We want to see a world where everyone feels excited waking up in the morning and make it easier to make a living doing something they love. We do this by empowering creators to start something they love and find their 1000 true fans.<br /><br />

          All of our initiatives in the future will hold and stay true to that vision and goal.<br /><br />

          We are a small independent team of friends that met in college.<br />
          Since 2017 back we were in college, we've built and launched many products used by thousands of our users. We have won many international & national hackathons. We have traveled and live together for a long time – all of which make our team stronger beyond our work and shaped us as a creator at heart.<br /><br />

          Our background comes from diverse industries – some of us have worked on top social consumer products with 224 million monthly active users, a marketplace platform with 135 million monthly active users, a top leading coding bootcamp, a top fintech company, and once founded a design studio.<br /><br />

          Now, we are a web3 studio focused on consumer products & NFTs called SUPAVIBE. We want to be fully committed to working on the next consumer web3 products on the Solana ecosystem. We believe Solana will have a massive impact on the web3 industry in the future.<br /><br />

          We are a team of developers, artists, designers, community & product builders. Where we are still full of young people. We believe with all of the diverse experiences that we have, the only thing that could stop our team is a lack of vision and energy. We will try our best to create the best product on Solana, we want to set a new standard especially for consumer web3 products that support individual artists and creators on Solana.<br /><br />

          As most NFT communities are now led by generative NFT profile picture type collectibles on Solana, we want to take a different path by start helping individual artists and creators to start their journey that has personal and authentic NFT art.<br /><br />

          We want to contribute to the Solana ecosystem by launching our first product called SUPADROP – a curated NFT art marketplace on Solana connecting top artists and collectors. We want to offer high-quality art led by community curation on our platform.<br /><br />

          Our goal is to minimize the barrier to enter to the NFT space and empower individual artists, creators, collectors, and NFT communities to support the creative economy on the Solana ecosystem.<br /><br />

          To achieve our goal – first, we need to fund our project. We will do this by launching our first NFT project via auction with 111 limited supply high-quality 3D NFT collectibles that offer tons of benefits to the holders. We will release 8 per week until all the supplies are sold out. Now our talented in-house artist is cooking something to create a new genre of NFT art that focuses on production-ready metaverse. Our NFT projects will be the sum up the source of our funding to build SUPADROP.<br /><br />

          The fund from our NFT projects will be used to help us build the platform, hire the best people, onboard & build the network of talented artists, creators, collectors and grow the community.<br /><br />

          We are here for the long game and we hope this project will go far.<br /><br />

          Massive thanks to Solana NFT communities & ecosystem that have inspired us & given us the energy to start our journey on Solana.<br /><br />

          <span style={{ color: '#FAFAFB' }}>– The SUPADROP Team</span>
        </p>
      </Col>

      {/* MOBILE */}
      <Col xs={20} sm={0} style={{ marginTop: 32 }}>
        <div style={{ fontSize: 28, color: '#FAFAFB', fontWeight: 'bold', marginBottom: 20 }}>OUR STORY</div>
        <p style={{ fontSize: 14, marginBottom: 120, color: '#7E7C7C' }}>
          We believe all the great things that shaped how we live today started from a personal project. We want to see a world where everyone feels excited waking up in the morning and make it easier to make a living doing something they love. We do this by empowering creators to start something they love and find their 1000 true fans.<br /><br />

          All of our initiatives in the future will hold and stay true to that vision and goal.<br /><br />

          We are a small independent team of friends that met in college.<br />
          Since 2017 back we were in college, we've built and launched many products used by thousands of our users. We have won many international & national hackathons. We have traveled and live together for a long time – all of which make our team stronger beyond our work and shaped us as a creator at heart.<br /><br />

          Our background comes from diverse industries – some of us have worked on top social consumer products with 224 million monthly active users, a marketplace platform with 135 million monthly active users, a top leading coding bootcamp, a top fintech company, and once founded a design studio.<br /><br />

          Now, we are a web3 studio focused on consumer products & NFTs called SUPAVIBE. We want to be fully committed to working on the next consumer web3 products on the Solana ecosystem. We believe Solana will have a massive impact on the web3 industry in the future.<br /><br />

          We are a team of developers, artists, designers, community & product builders. Where we are still full of young people. We believe with all of the diverse experiences that we have, the only thing that could stop our team is a lack of vision and energy. We will try our best to create the best product on Solana, we want to set a new standard especially for consumer web3 products that support individual artists and creators on Solana.<br /><br />

          As most NFT communities are now led by generative NFT profile picture type collectibles on Solana, we want to take a different path by start helping individual artists and creators to start their journey that has personal and authentic NFT art.<br /><br />

          We want to contribute to the Solana ecosystem by launching our first product called SUPADROP – a curated NFT art marketplace on Solana connecting top artists and collectors. We want to offer high-quality art led by community curation on our platform.<br /><br />

          Our goal is to minimize the barrier to enter to the NFT space and empower individual artists, creators, collectors, and NFT communities to support the creative economy on the Solana ecosystem.<br /><br />

          To achieve our goal – first, we need to fund our project. We will do this by launching our first NFT project via auction with 111 limited supply high-quality 3D NFT collectibles that offer tons of benefits to the holders. We will release 8 per week until all the supplies are sold out. Now our talented in-house artist is cooking something to create a new genre of NFT art that focuses on production-ready metaverse. Our NFT projects will be the sum up the source of our funding to build SUPADROP.<br /><br />

          The fund from our NFT projects will be used to help us build the platform, hire the best people, onboard & build the network of talented artists, creators, collectors and grow the community.<br /><br />

          We are here for the long game and we hope this project will go far.<br /><br />

          Massive thanks to Solana NFT communities & ecosystem that have inspired us & given us the energy to start our journey on Solana.<br /><br />

          <span style={{ color: '#FAFAFB' }}>– The SUPADROP Team</span>
        </p>
      </Col>
    </Row>
  );
};

export default About;
