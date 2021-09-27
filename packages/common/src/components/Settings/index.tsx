import React, { useCallback } from 'react';
import { Avatar, List, Button, Select } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ENDPOINTS, useConnectionConfig } from '../../contexts/connection';
import { useWalletModal } from '../../contexts';
import { notify, shortenAddress } from '../../utils';
import { CopyOutlined } from '@ant-design/icons';
import { ItemIcon, ListStyle } from './style';

export const Settings = ({ additionalSettings, setShowEdit = () => { } }: {
  additionalSettings?: JSX.Element;
  setShowEdit?: Function;
}) => {
  const { connected, disconnect, publicKey } = useWallet();
  const { endpoint, setEndpoint } = useConnectionConfig();
  const { setVisible } = useWalletModal();
  const open = useCallback(() => setVisible(true), [setVisible]);

  //   return (
  //     <>
  //       <div style={{ display: 'grid' }}>
  //         Network:{' '}
  //         <Select
  //           onSelect={setEndpoint}
  //           value={endpoint}
  //           style={{ marginBottom: 20 }}
  //         >
  //           {ENDPOINTS.map(({ name, endpoint }) => (
  //             <Select.Option value={endpoint} key={endpoint}>
  //               {name}
  //             </Select.Option>
  //           ))}
  //         </Select>
  //         {connected && (
  //           <>
  //             <span>Wallet:</span>
  //             {publicKey && (
  //               <Button
  //                 style={{ marginBottom: 5 }}
  //                 onClick={async () => {
  //                   if (publicKey) {
  //                     await navigator.clipboard.writeText(publicKey.toBase58());
  //                     notify({
  //                       message: 'Wallet update',
  //                       description: 'Address copied to clipboard',
  //                     });
  //                   }
  //                 }}
  //               >
  //                 <CopyOutlined />
  //                 {shortenAddress(publicKey.toBase58())}
  //               </Button>
  //             )}
  //
  //             <Button onClick={open} style={{ marginBottom: 5 }}>
  //               Change
  //             </Button>
  //             <Button
  //               type="primary"
  //               onClick={() => disconnect().catch()}
  //               style={{ marginBottom: 5 }}
  //             >
  //               Disconnect
  //             </Button>
  //           </>
  //         )}
  //         {additionalSettings}
  //       </div>
  //     </>
  //   );

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

        <List.Item onClick={() => disconnect().catch()}>
          <FeatherIcon icon="power" className={ItemIcon} />
          disconnect
        </List.Item>
      </List>
      {additionalSettings}
    </>
  );
};
