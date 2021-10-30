import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { Badge, Button } from 'antd';
import { ConnectButton, CurrentUserBadge, useMeta } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';

// utils
import getUserData from '../../database/userData';

// components
import { Notifications } from '../Notifications';
import { LABELS } from '../../constants';

// styles
import { ActivityBadge, ButtonContainer, LinkButton, LogoWrapper, RoundButton, Title } from './style';
import { GreyColor, WhiteColor } from '../../styles';

export const AppBar = () => {
  const { publicKey, connected } = useWallet();
  const { data: userData } = getUserData(publicKey?.toBase58());
  const { pathname } = useLocation();
  const { isBidPlaced, setBidPlaced } = useMeta();

  const hideActivityBadge = useCallback(() => setBidPlaced(false), [setBidPlaced]);

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
            {isBidPlaced && (
              <Badge dot className={ActivityBadge} color="#FF2D55">
                <Button className={`${LinkButton} ${GreyColor}`} type="link" onClick={hideActivityBadge}>
                  ACTIVITY
                </Button>
              </Badge>
            )}

            {!isBidPlaced && (
              <Button className={`${LinkButton} ${pathname.includes('activity') ? WhiteColor : GreyColor}`} type="link">
                ACTIVITY
              </Button>
            )}
          </Link>

          <Notifications />

          <CurrentUserBadge userData={userData} />

          <Link to={`/${userData ? userData.username : publicKey?.toBase58()}`}>
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
