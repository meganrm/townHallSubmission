import React from 'react';
import classNames from 'classnames';
import {
  Layout,
} from 'antd';

import MainFormController from '../FormController';
import SideBar from '../SideBar';
import './style.scss';

const {
  Header,
  Sider,
  Content,
} = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onCollapse = this.onCollapse.bind(this);
    this.state = {
      collapsed: false,
    };
  }

  onCollapse(collapsed) {
    console.log(collapsed);
    this.setState({
      collapsed,
    });
  }

  render() {
    const { collapsed } = this.state;
    const contentClass = classNames('body-content', {
      'side-bar-open': !collapsed,
    });
    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsible
          width={250}
          collapsedWidth="0"
          collapsed={collapsed}
          onCollapse={this.onCollapse}
          style={{
            height: '100vh',
            left: 0,
          }}
        >
          <SideBar />
        </Sider>
        <Layout className={contentClass}>
          <Content>
            <MainFormController />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
