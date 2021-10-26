import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../contexts';
import { ButtonStyle } from './style';

export interface ConnectButtonProps
  extends ButtonProps,
  React.RefAttributes<HTMLElement> {
  allowWalletChange?: boolean;
}

export const ConnectButton = (props: ConnectButtonProps) => {
  const { onClick, allowWalletChange, ...rest } = props;

  const { wallet, connect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const open = useCallback(() => setVisible(true), [setVisible]);

  const handleClick = useCallback(
    () => (wallet ? connect().catch(() => { }) : open()),
    [wallet, connect, open],
  );

  // only show if wallet selected or user connected

  return (
    <Button className={ButtonStyle} {...rest} onClick={handleClick} disabled={connected} shape="round">
      CONNECT
    </Button>
  );

  //   if (!wallet || !allowWalletChange) {
  //     return (
  //       <Button {...rest} onClick={handleClick} disabled={connected && disabled}>
  //         {connected ? props.children : 'Connect'}
  //       </Button>
  //     );
  //   }
  //
  //   return (
  //     <Dropdown.Button
  //       onClick={handleClick}
  //       disabled={connected && disabled}
  //       overlay={
  //         <Menu>
  //           <Menu.Item onClick={open}>Change Wallet</Menu.Item>
  //         </Menu>
  //       }
  //     >
  //       Connect
  //     </Dropdown.Button>
  //   );
};
