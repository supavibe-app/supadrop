import React from 'react';
import { Layout } from 'antd';

import { LABELS } from '../../constants';
import { AppBar } from '../AppBar';
import useWindowDimensions from '../../utils/layout';
import { HeaderStyle } from './style';

const { Header, Content } = Layout;

const paddingForLayout = (width: number) => {
  if (width <= 768) return '5px 10px';
  if (width > 768) return '10px 30px';
};

export const AppLayout = React.memo((props: any) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <Layout>
        <Header className={HeaderStyle}>
          <AppBar />
        </Header>
        <Content style={{ overflow: 'scroll', padding: '88px 0' }}>
          {props.children}
        </Content>
      </Layout>
    </>
  );
});
