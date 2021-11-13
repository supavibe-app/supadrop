import React from 'react';
import ReactGA from 'react-ga';
import { Row, Col, Button } from 'antd';
import Discord from '../../../assets/icons/discord';
import Twitter from '../../../assets/icons/twitter';
import FeatherIcons from 'feather-icons-react';
import { ButtonGroup, ButtonStyle, ButtonStyleFAQ, MobileButtonGroup, MobileButtonStyle, MobileButtonStyleFAQ } from './style';
import { DiscordURL, InstagramURL, TwitterURL, FaqURL } from '../../../constants';
import { DiscordButton, InstagramButton, TwitterButton } from '../Header/style';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Row justify="space-around" style={{ marginBottom: 72 }}>
      <Col className={ButtonGroup} span={10}>
        <Link to="/about">
          <Button type="link" className={ButtonStyle} onClick={() => {
            ReactGA.event({
              category: 'Our Story Button Selected',
              action: 'ourStoryButton',
              label: 'footer',
            });
          }}>
            <span>our story</span>
            <FeatherIcons icon="arrow-up-right" size={24} />
          </Button>
        </Link>

        <Button type="link" href={FaqURL} className={ButtonStyleFAQ} onClick={() => {
          ReactGA.event({
            category: 'FAQ Button Selected',
            action: 'faqButton',
            label: 'footer',
          });
        }}>
          <span>faq</span>
          <FeatherIcons icon="arrow-up-right" size={24} />
        </Button>
      </Col>

      <Col className={ButtonGroup} span={10} style={{ justifyContent: 'right' }}>
        <div>
          <a href={DiscordURL} target="_blank" onClick={() => {
            ReactGA.event({
              category: 'Discord Button Selected',
              action: 'discordButton',
              label: 'footer'
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
              label: 'footer'
            });
          }}>
            <div className={TwitterButton}>
              <Twitter />
            </div>
          </a>
        </div>

        <div>
          <a href={InstagramURL} target="_blank" onClick={() => {
            ReactGA.event({
              category: 'Instagram Button Selected',
              action: 'instagramButton',
              label: 'footer'
            });
          }}>
            <div className={InstagramButton}>
              <FeatherIcons icon="instagram" size={28} />
            </div>
          </a>
        </div>
      </Col>
    </Row>
  );
};

export const MobileFooter = () => {
  return (
    <Row justify="center" style={{ marginBottom: 72, marginRight: 28 }}>
      <Col className={MobileButtonGroup} span={20} style={{ marginBottom: 24 }}>
        <Link to="/about">
          <Button type="link" className={MobileButtonStyle} onClick={() => {
            ReactGA.event({
              category: 'Our Story Button Selected',
              action: 'ourStoryButton',
              label: 'footer',
            });
          }}>
            <span>our story</span>
            <FeatherIcons icon="arrow-up-right" size={16} />
          </Button>
        </Link>

        <Button type="link" href={FaqURL} target="_blank" className={MobileButtonStyleFAQ} onClick={() => {
          ReactGA.event({
            category: 'FAQ Button Selected',
            action: 'faqButton',
            label: 'footer',
          });
        }}>
          <span>faq</span>
          <FeatherIcons icon="arrow-up-right" size={16} />
        </Button>
      </Col>

      <Col className={MobileButtonGroup} span={20}>
        <div>
          <a href={DiscordURL} target="_blank" onClick={() => {
            ReactGA.event({
              category: 'Discord Button Selected',
              action: 'discordButton',
              label: 'footer'
            });
          }}>
            <div className={DiscordButton}>
              <img src="img/logo/discord.svg" width="20" alt="discord" />
            </div>
          </a>
        </div>

        <div>
          <a href={TwitterURL} target="_blank" onClick={() => {
            ReactGA.event({
              category: 'Twitter Button Selected',
              action: 'twitterButton',
              label: 'footer'
            });
          }}>
            <div className={TwitterButton}>
              <img src="img/logo/twitter.svg" width="20" alt="twitter" />
            </div>
          </a>
        </div>

        <div>
          <a href={InstagramURL} target="_blank" onClick={() => {
            ReactGA.event({
              category: 'Instagram Button Selected',
              action: 'instagramButton',
              label: 'footer'
            });
          }}>
            <div className={InstagramButton}>
              <FeatherIcons icon="instagram" size={20} />
            </div>
          </a>
        </div>
      </Col>
    </Row>
  );
};

export default Footer;
