import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { ConnectButton, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import FeatherIcon from 'feather-icons-react';
import { Notifications } from '../Notifications';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';
import { useMeta } from '../../contexts';

import { LABELS } from '../../constants';
import { ButtonContainer, CircleButton, LinkButton, LogoWrapper, RoundButton, Title } from './style';

const UserActions = () => {
  const { publicKey } = useWallet();
  const { whitelistedCreatorsByCreator, store } = useMeta();
  const pubkey = publicKey?.toBase58() || '';

  const canCreate = useMemo(() => {
    return (
      store?.info?.public ||
      whitelistedCreatorsByCreator[pubkey]?.info?.activated
    );
  }, [pubkey, whitelistedCreatorsByCreator, store]);

  return (
    <>
      {store && (
        <>
          {/* <Link to={`#`}>
            <Button className="app-btn">Bids</Button>
          </Link> */}
          {canCreate ? (
            <Link to={`/art/create`}>
              <Button className="app-btn">Create</Button>
            </Link>
          ) : null}
          <Link to={`/auction/create/0`}>
            <Button className="connector" type="primary">
              Sell
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
      }}
    >
      <Link to={`/`}>
        <Button className="app-btn">Explore</Button>
      </Link>
      <Link to={`/artworks`}>
        <Button className="app-btn">
          {connected ? 'My Items' : 'Artworks'}
        </Button>
      </Link>
      <Link to={`/artists`}>
        <Button className="app-btn">Creators</Button>
      </Link>
    </div>
  );
};

const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  const { connected } = useWallet();

  if (width < 768)
    return (
      <>
        <Dropdown
          arrow
          placement="bottomLeft"
          trigger={['click']}
          overlay={
            <Menu>
              <Menu.Item>
                <Link to={`/`}>
                  <Button className="app-btn">Explore</Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/artworks`}>
                  <Button className="app-btn">
                    {connected ? 'My Items' : 'Artworks'}
                  </Button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to={`/artists`}>
                  <Button className="app-btn">Creators</Button>
                </Link>
              </Menu.Item>
            </Menu>
          }
        >
          <MenuOutlined style={{ fontSize: '1.4rem' }} />
        </Dropdown>
      </>
    );

  return <DefaultActions />;
};

// export const AppBar = () => {
//   const { connected } = useWallet();
//
//   return (
//     <>
//       <div className="app-left app-bar-box">
//         {window.location.hash !== '#/analytics' && <Notifications />}
//         <div className="divider" />
//         <MetaplexMenu />
//       </div>
//       {connected ? (
//         <div className="app-right app-bar-box">
//           <UserActions />
//           <CurrentUserBadge
//             showBalance={false}
//             showAddress={false}
//             iconSize={24}
//           />
//         </div>
//       ) : (
//         <ConnectButton type="primary" allowWalletChange />
//       )}
//     </>
//   );

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

            <Button className={CircleButton} icon={<FeatherIcon icon="bell" size="20" />} shape="circle" />

            <CurrentUserBadge showBalance={true} showAddress={true} />

            <Button className={CircleButton} icon={<FeatherIcon icon="sun" size="20" shape="circle" />} />
          </div>
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
          <Button className={CircleButton} icon={<FeatherIcon icon="sun" size="20" shape="circle" />} />
        </div>
      </>
    );
};
