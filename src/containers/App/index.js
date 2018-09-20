import React from 'react';
import {
  Layout,
} from 'antd';

import MainForm from '../MainForm';
import SideBar from '../SideBar';

const {
  Header,
  Footer,
  Sider,
  Content,
} = Layout;
export default () => (
  <div>

      <Layout>
      <Sider 
        breakpoint="xs"
        style={{
            overflow: 'auto', 
            height: '100vh', 
            position: 'fixed', 
            left: 0 
            }}>
        <SideBar />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ background: '#fff', padding: 10 }}>        
            <h3 className="text-success">Enter a new town hall event</h3>
        </Header>
        <Content style={{ margin: '0 48px 0', overflow: 'initial' }}>
          <MainForm />
        </Content>
        </Layout>
    </Layout>
  </div>

);
