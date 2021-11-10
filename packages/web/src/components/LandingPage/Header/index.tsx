import React from 'react';
import ReactGA from 'react-ga';
import { Row, Col, Button } from 'antd';

import Discord from '../../../assets/icons/discord';
import Twitter from '../../../assets/icons/twitter';
import { DiscordURL, TwitterURL } from '../../../constants';

import { ButtonGroup, ButtonStyle, Description, DiscordButton, GradientText, MainTitle, MobileButtonGroup, MobileButtonStyle, MobileDescription, MobileMainTitle, MobileSecondaryTitle, SecondaryTitle, TwitterButton } from './style';

const HeaderSection = () => {
  return (
    <Row justify="center" style={{ marginTop: 80 }}>
      <Col span={13}>
        <div className={`${MainTitle} ${GradientText}`}>Invest in Culture</div>
        <div className={SecondaryTitle}>Create • Share • Collect Digital Arts</div>
        <div className={Description}>a curated NFT art & collectibles marketplace on solana –empowering the future of creative economy • connecting authentic creators and collectors</div>

        <div className={ButtonGroup}>
          <div>
            <Button
              className={ButtonStyle}
              href="https://forms.gle/Wxotbnjj9j5mPdBaA"
              target="_blank"
              onClick={() => {
                ReactGA.event({
                  category: 'Apply as Creator Selected',
                  action: 'applyCreator',
                  label: 'header'
                });
              }}>
              <div>
                <span style={{ marginRight: 8 }}>APPLY AS CREATOR</span>
                <span className={GradientText}>//</span>
              </div>
            </Button>
          </div>

          <div>
            <a href={DiscordURL} target="_blank" onClick={() => {
              ReactGA.event({
                category: 'Discord Button Selected',
                action: 'discordButton',
                label: 'header'
              });
            }}>
              <div className={DiscordButton}>
                <Discord />
              </div>
            </a>
          </div>

          <div>
            <a href={TwitterURL} target="_blank" onClick={() => {
              ReactGA.event({
                category: 'Twitter Button Selected',
                action: 'twitterButton',
                label: 'header'
              });
            }}>
              <div className={TwitterButton}>
                <Twitter />
              </div>
            </a>
          </div>
        </div>
      </Col>

      <Col span={9} style={{ textAlign: 'center' }}>
        <img src="img/logo/supadrop-green.png" width="320" />
      </Col>
    </Row>
  );
};

export const MobileHeaderSection = () => {
  return (
    <Row justify="center">
      <Col span={20}>
        <img src="img/logo/supadrop-green.png" width="80" style={{ marginTop: 40 }} />

        <div className={`${MobileMainTitle} ${GradientText}`}>Invest in Culture</div>
        <div className={MobileSecondaryTitle}>Create • Share • Collect Digital Arts</div>
        <div className={MobileDescription}>a curated NFT art & collectibles marketplace on solana –empowering the future of creative economy • connecting authentic creators and collectors</div>

        <div className={MobileButtonGroup}>
          <div>
            <Button className={MobileButtonStyle} href="https://forms.gle/Wxotbnjj9j5mPdBaA" target="_blank" onClick={() => {
              ReactGA.event({
                category: 'Apply as Creator Selected',
                action: 'applyCreator',
                label: 'header'
              });
            }}>
              <div>
                <span style={{ marginRight: 8 }}>APPLY AS CREATOR</span>
                <span className={GradientText}>//</span>
              </div>
            </Button>
          </div>

          <div>
            <a href={DiscordURL} target="_blank" onClick={() => {
              ReactGA.event({
                category: 'Discord Button Selected',
                action: 'discordButton',
                label: 'header'
              });
            }}>
              <div className={DiscordButton}>
                <img src="img/logo/discord.svg" width="24" />
              </div>
            </a>
          </div>

          <div>
            <a href={TwitterURL} target="_blank" onClick={() => {
              ReactGA.event({
                category: 'Twitter Button Selected',
                action: 'twitterButton',
                label: 'header'
              });
            }}>
              <div className={TwitterButton}>
                <img src="img/logo/twitter.svg" width="24" />
              </div>
            </a>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default HeaderSection;
