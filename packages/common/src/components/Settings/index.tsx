import React, { useCallback } from 'react';
import { Avatar, List } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { shortenAddress } from '../../utils';
import { useNativeAccount, formatNumber } from '../..';
import { AddressInfo, BalanceInfo, ItemIcon, ListStyle } from './style';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const Settings = ({ additionalSettings, setShowPopover = () => { } }: {
  additionalSettings?: JSX.Element;
  setShowPopover?: Function;
}) => {
  const { disconnect, publicKey } = useWallet();
  const { push } = useHistory();
  const { account } = useNativeAccount();
  const balance = formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL);

  return (
    <List className={ListStyle}>
      <List.Item>
        <div onClick={() => {
          setShowPopover(false);
          push(`/${publicKey}`)
        }}>
          <Avatar className={ItemIcon} />
          view profile
        </div>
      </List.Item>

      <List.Item>
        <a href={`https://explorer.solana.com/address/${publicKey.toBase58()}`} target="_blank">
          <div className={BalanceInfo}>{balance} SOL</div>
          <div className={AddressInfo}>
            <div>{publicKey && shortenAddress(publicKey.toBase58())}{' '}</div>
            <FeatherIcon icon="external-link" size="16" />
          </div>
        </a>
      </List.Item>

      <List.Item onClick={() => disconnect().catch()}>
        <FeatherIcon icon="power" className={ItemIcon} />
        disconnect
      </List.Item>
    </List>
  );
};
