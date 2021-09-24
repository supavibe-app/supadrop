import React, { useCallback } from 'react';
import { Avatar, List, Select } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ENDPOINTS, useConnectionConfig } from '../../contexts/connection';
import { useWalletModal } from '../../contexts';
import { ItemIcon, ListStyle } from './style';

export const Settings = ({ additionalSettings, setShowEdit = () => { } }: {
  additionalSettings?: JSX.Element;
  setShowEdit?: Function;
}) => {
  const { disconnect } = useWallet();
  const { endpoint, setEndpoint } = useConnectionConfig();
  const { setVisible } = useWalletModal();
  const open = useCallback(() => setVisible(true), [setVisible]);

  return (
    <>
      {/* TODO-Iyai: Show this in staging */}
      {/* Network:{' '}
        <Select
          onSelect={setEndpoint}
          value={endpoint}
          style={{ marginBottom: 20 }}
        >
          {ENDPOINTS.map(({ name, endpoint }) => (
            <Select.Option value={endpoint} key={endpoint}>
              {name}
            </Select.Option>
          ))}
        </Select> */}
      <List className={ListStyle}>
        <List.Item onClick={() => setShowEdit()}>
          <Avatar className={ItemIcon} src="https://cdn.discordapp.com/attachments/459348449415004161/888712098589319168/Frame_40_1.png" />
          edit profile
        </List.Item>

        <List.Item>
          <Select
            onSelect={setEndpoint}
            value={endpoint}
            style={{ marginBottom: 20 }}
          >
            {ENDPOINTS.map(({ name, endpoint }) => (
              <Select.Option value={endpoint} key={endpoint}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </List.Item>

        <List.Item onClick={() => disconnect().catch()}>
          <FeatherIcon icon="power" className={ItemIcon} />
          disconnect
        </List.Item>
      </List>
      {additionalSettings}
    </>
  );
};
