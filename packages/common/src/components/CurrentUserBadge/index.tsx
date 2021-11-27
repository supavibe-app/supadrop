import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Avatar, Popover } from 'antd';

import { Settings } from '../Settings';
import { ProfilePopover, WalletWrapper } from './style';
import { UserData } from '../..';
import { Identicon } from '..';

export const CurrentUserBadge = ({ userData }: { userData?: UserData; }) => {
  const { wallet, publicKey } = useWallet();
  const [showPopover, setShowPopover] = useState(false);

  if (!wallet || !publicKey) {
    return null;
  }

  return (
    <div className={WalletWrapper}>
      <Popover
        overlayClassName={ProfilePopover}
        color="#000000"
        content={<Settings userData={userData} setShowPopover={setShowPopover} />}
        trigger="click"
        placement="bottomRight"
        onVisibleChange={visible => setShowPopover(visible)}
        visible={showPopover}
      >
        <Avatar src={
          userData?.img_profile ||
          <Identicon address={userData?.wallet_address} style={{ width: 42 }} />}
          size={42}
          style={{ cursor: 'pointer' }}
        />
      </Popover>
    </div>
  );
};
