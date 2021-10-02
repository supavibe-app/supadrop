import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { Button } from 'antd';
import { ConnectButton, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';

import { LABELS } from '../../constants';
import { ButtonContainer, LinkButton, LogoWrapper, RoundButton, Title } from './style';
import { GreyColor, WhiteColor } from '../../styles';

export const AppBar = () => {
  const { connected } = useWallet();
  const { pathname } = useLocation();

  if (connected) {
    return (
      <>
        <Link className={LogoWrapper} to="/">
          <img src="/logo.svg" height="80" alt="Logo" />
          <span className={Title}>{LABELS.APP_TITLE}</span>
        </Link>

        <div className={ButtonContainer}>
          <Link to={`/auction`}>
            <Button className={`${LinkButton} ${pathname.includes('auction') ? WhiteColor : GreyColor}`} type="link">
              AUCTION
            </Button>
          </Link>

          <Link to={`/market`}>
            <Button className={`${LinkButton} ${pathname.includes('market') ? WhiteColor : GreyColor}`} type="link">
              MARKET
            </Button>
          </Link>

          <Link to={`/activity`}>
            <Button className={`${LinkButton} ${pathname.includes('activity') ? WhiteColor : GreyColor}`} type="link">
              ACTIVITY
            </Button>
          </Link>

          <Notifications />

          <CurrentUserBadge showBalance={true} showAddress={true} />

          <Link to={`/auction/create/0`}>
            <Button className={RoundButton} type="default" shape="round">
              SELL
            </Button>
          </Link>

          {/* <Button className={CircleButton} icon={<FeatherIcon icon="sun" size="20" shape="circle" />} /> */}
        </div >
      </>
    );
  }

  return (
    <>
      <Link className={LogoWrapper} to="/">
        <img src="/logo.svg" height="80" alt="Logo" />
        <span className={Title}>{LABELS.APP_TITLE}</span>
      </Link>

      <div className={ButtonContainer}>
        <ConnectButton type="default" allowWalletChange />
        {/* <Button className={CircleButton} icon={<FeatherIcon icon="sun" size="20" shape="circle" />} /> */}
      </div>
    </>
  );
};
