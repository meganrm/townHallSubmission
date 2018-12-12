import React from 'react';
import {
  Layout,
} from 'antd';

import MainFormController from '../FormController';
import SideBar from '../SideBar';

const {
  Header,
  Sider,
  Content,
} = Layout;
export default () => (
  <div>

    <Layout>
      <Sider
        breakpoint="xs"
        style={{
          height: '100vh',
          left: 0,
          overflow: 'auto',
          position: 'fixed',
        }}
      >
        <SideBar />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ background: '#fff', padding: 10 }}>
          <h3 className="text-success">Enter a new town hall event</h3>
        </Header>
        <Content style={{ margin: '0 48px 0', overflow: 'initial' }}>
          <MainFormController />
        </Content>
      </Layout>
    </Layout>
  </div>

);
