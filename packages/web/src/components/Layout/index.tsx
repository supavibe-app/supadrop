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
        <Content style={{ paddingTop: '168px' }}>
          {props.children}
        </Content>
      </Layout>
    </>
  );
});
