import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Avatar, Button, Modal, Popover } from 'antd';

import { Settings } from '../Settings';
import { ModalEditProfile, ProfilePopover, WalletWrapper } from './style';

export const CurrentUserBadge = (props: {
  showBalance?: boolean;
  showAddress?: boolean;
  iconSize?: number;
}) => {
  const { wallet, publicKey } = useWallet();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  if (!wallet || !publicKey) {
    return null;
  }

  const handleShowEditProfile = () => {
    setShowEditProfile(true);
    setShowPopover(false);
  };

  return (
    <>
      <div className={WalletWrapper}>
        <Popover
          overlayClassName={ProfilePopover}
          color="#000000"
          content={<Settings setShowEdit={handleShowEditProfile} />}
          trigger="click"
          placement="bottomRight"
          onVisibleChange={visible => setShowPopover(visible)}
          visible={showPopover}
        >
          <Avatar src={wallet.icon} size={42} style={{ cursor: 'pointer' }} />
        </Popover>
      </div>

      <Modal
        className={ModalEditProfile}
        title="edit profile"
        visible={showEditProfile}
        onCancel={() => setShowEditProfile(false)}
        footer={[
          <Button key="save" type="link" style={{ fontWeight: 'bold' }} disabled>
            save
          </Button>,
        ]}
      >
        huyu
      </Modal>
    </>
  );
};
