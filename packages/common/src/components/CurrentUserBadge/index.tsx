import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Avatar, Button, Modal, Popover } from 'antd';

import { Settings } from '../Settings';
import { supabase } from '../../supabaseClient';
import { ModalEditProfile, ProfilePopover, WalletWrapper } from './style';

export const CurrentUserBadge = (props: {
  showBalance?: boolean;
  showAddress?: boolean;
  iconSize?: number;
}) => {
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
        content={<Settings setShowPopover={setShowPopover} />}
        trigger="click"
        placement="bottomRight"
        onVisibleChange={visible => setShowPopover(visible)}
        visible={showPopover}
      >
        <Avatar src={wallet.icon} size={42} style={{ cursor: 'pointer' }} />
      </Popover>
    </div>
  );
};
