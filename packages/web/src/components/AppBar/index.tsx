import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ConnectButton, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';

import { LABELS } from '../../constants';
import { ButtonContainer, LinkButton, LogoWrapper, RoundButton, Title } from './style';

export const AppBar = () => {
  const { connected } = useWallet();

  if (connected) {
    return (
      <>
        <Link className={LogoWrapper} to="/">
          <img src="/logo.svg" height="80" alt="Logo" />
          <span className={Title}>{LABELS.APP_TITLE}</span>
        </Link>

        <div className={ButtonContainer}>
          <Link to={`/activity`}>
            <Button className={LinkButton} type="link">
              ACTIVITY
            </Button>
          </Link>

          <Link to={`/auction/create/0`}>
            <Button className={RoundButton} type="default" shape="round">
              SELL
            </Button>
          </Link>

          <Notifications />

          <CurrentUserBadge showBalance={true} showAddress={true} />

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
