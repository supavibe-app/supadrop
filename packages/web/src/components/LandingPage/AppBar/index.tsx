import React, { useState } from "react";
import { Button, Col, Row, List, Popover } from "antd";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import FeatherIcon from "feather-icons-react";
import { ButtonListStyle, ButtonStyle, LandingButtonContainer, LogoWrapper, MobileAppBarStyle, MobileTitle, PopoverStyle, Title } from "./style";
import { DiscordURL, FaqURL, LABELS } from "../../../constants";
import { uGradientText } from "../../../styles";

const AppBar = ({ refMembership, refWhitelist }: { refMembership: React.MutableRefObject<HTMLInputElement>, refWhitelist: React.MutableRefObject<HTMLInputElement> }) => {
  return (
    <Row justify="space-between" style={{ width: '100%' }}>
      {/*  DESKTOP */}
      <Col span={12}>
        <Link className={LogoWrapper} to="/">
          <img src="/logo.svg" height="80" alt="Logo" />
          <span className={Title}>{LABELS.APP_TITLE}</span>
        </Link>
      </Col>

      <Col className={LandingButtonContainer} span={12} style={{ paddingRight: 80 }}>
        <Button className={ButtonStyle} type="link" href={FaqURL} target="_blank">
          <span>faq</span>
          <FeatherIcon icon="arrow-up-right" size="16" />
        </Button>
        <Button className={ButtonStyle} type="link" href="https://supadrop.com/deck" target="_blank">
          <span>litepaper</span>
          <FeatherIcon icon="arrow-up-right" size="16" />
        </Button>
        <Button className={ButtonStyle} type="link" onClick={() => refMembership.current.scrollIntoView({ behavior: 'smooth' })}>membership</Button>
        <Button className={ButtonStyle} type="link" onClick={() => refWhitelist.current.scrollIntoView({ behavior: 'smooth' })}>whitelist</Button>
        <Button className={ButtonStyle} type="link" style={{ color: '#FAFAFB' }} href={DiscordURL} target="_blank">
          <span style={{ marginRight: 8 }}>join as a creator</span>
          <span className={uGradientText}>//</span>
        </Button>
      </Col>
    </Row>
  );
};

export const MobileAppBar = ({ refMembership, refWhitelist }: { refMembership: React.MutableRefObject<HTMLInputElement>, refWhitelist: React.MutableRefObject<HTMLInputElement> }) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Row justify="space-between" className={MobileAppBarStyle} style={{ width: '100%' }}>
      <Col span={12}>
        <Link className={LogoWrapper} to="/">
          <img src="/logo.svg" height="58" alt="Logo" />
          <span className={MobileTitle}>{LABELS.APP_TITLE}</span>
        </Link>
      </Col>

      <Col className={LandingButtonContainer} span={12} style={{ paddingRight: 36 }}>
        <Popover
          placement="bottomRight"
          trigger="click"
          onVisibleChange={value => setShowPopover(value)}
          visible={showPopover}
          overlayClassName={PopoverStyle}
          content={() => (
            <List>
              <List.Item className={ButtonListStyle}>
                <a href={FaqURL} style={{ color: '#FAFAFB', width: '100%' }}>
                  <span>faq</span>
                  <FeatherIcon icon="arrow-up-right" size="18" />
                </a>
              </List.Item>

              <List.Item className={ButtonListStyle}>
                <a href="https://supadrop.com/deck" style={{ color: '#FAFAFB', width: '100%' }}>
                  <span>litepaper</span>
                  <FeatherIcon icon="arrow-up-right" size="18" />
                </a>
              </List.Item>

              <List.Item className={ButtonListStyle} onClick={() => {
                refMembership.current.scrollIntoView({ behavior: 'smooth' });
                setShowPopover(false);
              }}>
                <span>membership</span>
              </List.Item>

              <List.Item className={ButtonListStyle} onClick={() => {
                refWhitelist.current.scrollIntoView({ behavior: 'smooth' });
                setShowPopover(false);
              }}>
                <span>whitelist</span>
              </List.Item>

              <List.Item className={ButtonListStyle}>
                <a href={DiscordURL} style={{ color: '#FAFAFB', width: '100%' }}>
                  <span style={{ marginRight: 8 }}>join as a creator</span>
                  <span className={uGradientText}>//</span>
                </a>
              </List.Item>
            </List>
          )}
        >
          <FeatherIcon icon="menu" />
        </Popover>
      </Col>
    </Row>
  );
}

export default AppBar;
