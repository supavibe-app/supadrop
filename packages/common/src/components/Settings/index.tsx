import React from 'react';
import { Avatar, List } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { shortenAddress } from '../../utils';
import { useNativeAccount, formatNumber, UserData } from '../..';
import { AddressInfo, BalanceInfo, ItemIcon, ListStyle } from './style';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Identicon } from '..';

export const Settings = ({ userData, setShowPopover = () => { } }: {
  userData?: UserData;
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
          push(`/${userData?.username ? userData.username : publicKey}`);
        }}>
          <Avatar src={userData?.img_profile || <Identicon address={userData?.wallet_address} style={{ width: 32 }} />} className={ItemIcon} />
          view profile
        </div>
      </List.Item>

      <List.Item>
        {publicKey && (
          <a href={`https://explorer.solana.com/address/${publicKey.toBase58()}`} target="_blank">
            <div className={BalanceInfo}>{balance} SOL</div>
            <div className={AddressInfo}>
              <div>{publicKey && shortenAddress(publicKey.toBase58())}{' '}</div>
              <FeatherIcon icon="external-link" size="16" />
            </div>
          </a>
        )}
      </List.Item>

      <List.Item onClick={() => disconnect().catch()}>
        <FeatherIcon icon="power" className={ItemIcon} />
        disconnect
      </List.Item>
    </List>
  );
};
