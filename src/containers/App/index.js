import React from 'react';
import classNames from 'classnames';
import {
  Layout,
  Affix,
  Icon,
} from 'antd';

import PageHeader from '../../components/PageHeader';
import MainFormController from '../FormController';
import SideBar from '../SideBar';
import MobileView from '../MobileView';

import './style.scss';

const {
  Sider,
  Content,
} = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    this.state = {
      collapsed: false,
      width: window.innerWidth,
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange() {
    this.setState({ width: window.innerWidth });
  }

  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const {
      collapsed,
      width
    } = this.state;
    const isMobile = width <= 500;
    const contentClass = classNames('body-content', {
      'side-bar-closed': collapsed,
    });
    if (isMobile) {
      return (
        <MobileView />
      );
    } else {
      return (
        <Layout>
          <PageHeader />
          <Layout>
            <Layout>
              <Affix>
                <Sider
                  breakpoint="lg"
                  collapsible
                  width={250}
                  collapsedWidth="0"
                  collapsed={collapsed}
                  style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    marginBottom: 40,
                  }}
                >
                  <SideBar />
                </Sider>
              </Affix>
              <Affix>
                <Icon
                  className={`${contentClass} trigger`}
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Affix>
              <Content className={contentClass}>
                <MainFormController />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      );
    }
  }
}

export default App;
