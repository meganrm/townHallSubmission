import React from 'react';
import PropTypes from 'prop-types';
import {
  Layout,
  Affix,
  Icon,
  Tooltip,
} from 'antd';
import {
  connect,
} from 'react-redux';
import {
  getTownHall,
} from '../../state/townhall/selectors';

import PageHeader from '../../components/PageHeader';
import MainFormController from '../FormController';
import SideBar from '../SideBar';
import MobileView from '../MobileView';

import './style.scss';

const {
  Sider,
  Content,
  Header
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
    const navMargin = collapsed ? '0px' : '250px';
    if (isMobile) {
      return (
        <MobileView />
      );
    } else {
      return (
        <Layout>
          <PageHeader 
            currentTownHall={this.props.currentTownHall}
          />
          <Layout>
            <Affix>
              <Sider
                trigger={null}
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
            <Header style={{ background: '#fff', padding: 0 }}>
              <Affix>
              <Tooltip placement={this.state.collapsed ? 'right' : 'top'} title="Toggle Navbar">
                <Icon
                  className={`trigger`}
                  style={{ marginLeft: navMargin }}
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
                </Tooltip>
              </Affix>
            </Header>
            <Content style={{ marginTop: '1px', overflow: 'initial' }}>
              <MainFormController />
            </Content>
          </Layout>
        </Layout>
      );
    }
  }
}

const mapStateToProps = state => ({
  currentTownHall: getTownHall(state),
});

const mapDispatchToProps = dispatch => ({  });

App.propTypes = {
  currentTownHall: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);