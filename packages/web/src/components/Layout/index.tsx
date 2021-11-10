import React from 'react';
import { Layout } from 'antd';

import { AppBar } from '../AppBar';
import { HeaderStyle } from './style';
import { useLocation } from 'react-router';

const { Header, Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  const { pathname } = useLocation();
  const sticky = pathname !== '/' && pathname !== '/about';

  return (
    <Layout style={{ overflow: 'hidden' }}>
      <Header className={HeaderStyle({ sticky })}>
        <AppBar />
      </Header>

      {sticky && <div style={{ height: 80 }} />}

      <Content>
        {props.children}
      </Content>
    </Layout>
  );
});
