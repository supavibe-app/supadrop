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
  const { onClick, children, disabled, allowWalletChange, ...rest } = props;

  const { wallet, connect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const open = useCallback(() => setVisible(true), [setVisible]);

  const handleClick = useCallback(
    () => (wallet ? connect().catch(() => { }) : open()),
    [wallet, connect, open],
  );

  return (
    <Button className={ButtonStyle} {...rest} onClick={handleClick} disabled={connected && disabled} shape="round">
      {connected ? props.children : 'CONNECT'}
    </Button>
  );
};
