import React from 'react';
import { useConnectionConfig } from '@oyster/common';

import { List, Button } from 'antd';

const MoreOptions = ({ art }) => {
  const { endpoint } = useConnectionConfig();

  return (
    <List>
      <List.Item>
        <Button type="link" onClick={() => window.open(art.uri || '', '_blank')}>
          view on arweave
        </Button>
      </List.Item>
      <List.Item>
        <Button
          type="link"
          onClick={() =>
            window.open(
              `https://explorer.solana.com/account/${art?.mint || ''}${endpoint.name.indexOf('main') >= 0 ? '' : `?cluster=${endpoint.name}`
              }`,
              '_blank',
            )
          }
        >
          view on solana
        </Button>
      </List.Item>
    </List>
  );
};

export default MoreOptions;
