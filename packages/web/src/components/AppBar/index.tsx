import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router';
import { Badge, Button, Row, Col, Drawer, List } from 'antd';
import { ConnectButton, CurrentUserBadge, useMeta } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import FeatherIcon from 'feather-icons-react';
import ReactGA from 'react-ga';

// utils
import getUserData from '../../database/userData';

// components
import { Notifications } from '../Notifications';
import { FaqURL, LABELS } from '../../constants';

// styles
import {
  ActivityBadge,
  ButtonContainer,
  ButtonStyle,
  ButtonStyleFAQ,
  LandingButtonContainer,
  LinkButton,
  LogoWrapper,
  MobileTitle,
  RoundButton,
  Title,
} from './style';
import { GreyColor, WhiteColor } from '../../styles';

export const AppBar = () => {
  const { publicKey, connected } = useWallet();
  const { data: userData } = getUserData(publicKey?.toBase58());
  const { pathname } = useLocation();
  const { isBidPlaced, setBidPlaced } = useMeta();
  const [showMenu, setShowMenu] = useState(false);
  const { push } = useHistory();
  const isLandingPage = pathname === '/' || pathname === '/about';

  const hideActivityBadge = useCallback(
    () => setBidPlaced(false),
    [setBidPlaced],
  );

  if (connected) {
    return (
      <>
        <Link className={LogoWrapper} to="/">
          <img src="/logo.svg" height="80" alt="Logo" />
          <span className={Title}>{LABELS.APP_TITLE}</span>
        </Link>

        <div className={ButtonContainer}>
          <Link to={`/auction`}>
            <Button
              className={`${LinkButton} ${pathname.includes('auction') ? WhiteColor : GreyColor}`}
              type="link"
            >
              AUCTION
            </Button>
          </Link>

          <Link to={`/market`}>
            <Button
              className={`${LinkButton} ${pathname.includes('market') ? WhiteColor : GreyColor}`}
              type="link"
            >
              MARKET
            </Button>
          </Link>

          <Link to={`/activity`}>
            {isBidPlaced && (
              <Badge dot className={ActivityBadge} color="#FF2D55">
                <Button
                  className={`${LinkButton} ${GreyColor}`}
                  type="link"
                  onClick={hideActivityBadge}
                >
                  ACTIVITY
                </Button>
              </Badge>
            )}

            {!isBidPlaced && (
              <Button
                className={`${LinkButton} ${pathname.includes('activity') ? WhiteColor : GreyColor}`}
                type="link"
              >
                ACTIVITY
              </Button>
            )}
          </Link>

          <Notifications />

          <CurrentUserBadge userData={userData} />

          <Link
            to={`/${userData?.username ? userData.username : publicKey?.toBase58()}`}
          >
            <Button className={RoundButton} type="default" shape="round">
              SELL
            </Button>
          </Link>

          {/* <Button className={CircleButton} icon={<FeatherIcon icon="sun" size="20" shape="circle" />} /> */}
        </div>
      </>
    );
  }

  return (
    <Row justify="space-between" style={{ width: '100%' }}>
      {/*  DESKTOP */}
      <Col xs={0} sm={12}>
        <Link className={LogoWrapper} to="/">
          <img src="/logo.svg" height="80" alt="Logo" />
          <span className={Title}>{LABELS.APP_TITLE}</span>
        </Link>
      </Col>

      <Col className={LandingButtonContainer} xs={0} sm={12}>
        {isLandingPage && (
          <>
            <Link
              to="/about"
              onClick={() => {
                ReactGA.event({
                  category: 'Our Story Button Selected',
                  action: 'ourStoryButton',
                  label: 'header',
                });
              }}
            >
              <Button type="link" size="large" className={ButtonStyle}>
                our story
              </Button>
            </Link>

            <Button
              type="link"
              size="large"
              href={FaqURL}
              className={ButtonStyleFAQ}
              onClick={() => {
                ReactGA.event({
                  category: 'FAQ Button Selected',
                  action: 'faqButton',
                  label: 'header',
                });
              }}
            >
              faq
            </Button>
          </>
        )}

        {!isLandingPage && <ConnectButton type="default" allowWalletChange />}
        {/* <Button className={CircleButton} icon={<FeatherIcon icon="sun" size="20" shape="circle" />} /> */}
      </Col>

      {/* MOBILE */}
      <Col xs={12} sm={0}>
        <Link className={LogoWrapper} to="/">
          <img src="/logo.svg" height="58" alt="Logo" />
          <span className={MobileTitle}>{LABELS.APP_TITLE}</span>
        </Link>
      </Col>

      <Col className={LandingButtonContainer} xs={12} sm={0}>
        <div onClick={() => setShowMenu(true)}>
          <FeatherIcon icon="menu" />
        </div>
      </Col>

      <Drawer
        title="SUPADROP"
        placement="top"
        onClose={() => setShowMenu(false)}
        visible={showMenu}
      >
        <List>
          <List.Item
            className={ButtonStyle}
            style={{ fontSize: 18 }}
            onClick={() => {
              push('/about');
              setShowMenu(false);
              ReactGA.event({
                category: 'Our Story Button Selected',
                action: 'ourStoryButton',
                label: 'header',
              });
            }}
          >
            <span>our story</span>
            <FeatherIcon icon="arrow-up-right" size={18} />
          </List.Item>

          <List.Item
            className={ButtonStyle}
            style={{ fontSize: 18 }}
            onClick={() => {
              window.location.href = FaqURL;
              ReactGA.event({
                category: 'FAQ Button Selected',
                action: 'faqButton',
                label: 'header',
              });
            }}
          >
            <span>faq</span>
            <FeatherIcon icon="arrow-up-right" size={18} />
          </List.Item>
        </List>
      </Drawer>
    </Row>
  );
};
