import React from 'react';
import { Layout } from 'antd';

import { AppBar } from '../AppBar';
import { HeaderStyle } from './style';

const { Header, Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  return (
    <>
      <Layout style={{ overflow: 'hidden' }}>
        <Header className={HeaderStyle}>
          <AppBar />
        </Header>

        <div style={{ height: 80 }} />

        <Content>
          {props.children}
        </Content>
      </Layout>
    </>
  );
});
