import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  getTownHall,
} from '../../state/townhall/selectors';

// ANTD MOBILE COMPONENT IMPORTS //
import Button from 'antd-mobile/lib/button';
import 'antd-mobile/lib/button/style/css';

import WhiteSpace from 'antd-mobile/lib/white-space';
import 'antd-mobile/lib/white-space/style/css';

import Modal from 'antd-mobile/lib/modal';
import 'antd-mobile/lib/modal/style/css';

import NavBar from 'antd-mobile/lib/nav-bar';
import 'antd-mobile/lib/nav-bar/style/css';

import Icon from 'antd-mobile/lib/icon';
import 'antd-mobile/lib/icon/style/css';

import Drawer from 'antd-mobile/lib/drawer';
import 'antd-mobile/lib/drawer/style/css';
/////////////////////////////////////

import MainFormController from '../FormController';
import PageHeader from '../../components/PageHeader';
import SideBar from '../SideBar';

import './style.scss';

class MobileView extends React.Component {
  static replacer(key, value) {
    if (!value || value.length === 0) {
      return undefined;
    }
    return value;
  }

  constructor(props) {
    super(props);
    this.drawerToggle = this.drawerToggle.bind(this);
    this.showDataObj = this.showDataObj.bind(this);
    this.onCloseDataObj = this.onCloseDataObj.bind(this);
    this.state = {
      open: false,
      dataObjectModal: false,
    }
  }
  drawerToggle(...args) {
    this.setState({ open: !this.state.open });
  }
  showDataObj = key => (e) => {
    e.preventDefault(); // Android //
    this.setState({
      [key]: true,
    });
  }
  onCloseDataObj = key => () => {
    this.setState({
      [key]: false,
    });
  }
  render() {
    const {
      currentTownHall,
    } = this.props;
    return (
      <div>
        <PageHeader />
        <NavBar icon={<Icon type="ellipsis" />} onLeftClick={this.drawerToggle}>Menu</NavBar>
        <Drawer
          className="my-drawer"
          style={{ minHeight: document.documentElement.clientHeight }}
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
          sidebar={<SideBar />}
          open={this.state.open}
          onOpenChange={this.drawerToggle}
        >
          <Button onClick={this.showDataObj('dataObjectModal')} style={{ width: '100%', zIndex: 3 }}>Data Object</Button>
          <WhiteSpace />
          <MainFormController mobile={true}/>
          <Modal
            popup
            visible={this.state.dataObjectModal}
            onClose={this.onCloseDataObj('dataObjectModal')}
            animationType="slide-up"
          >
          <pre className="language-bash" style={{ overflow: 'visible', textAlign: 'left' }}>
            {
              JSON.stringify(currentTownHall, MobileView.replacer, 2)
            }
          </pre>
          </Modal>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentTownHall: getTownHall(state),
});

const mapDispatchToProps = dispatch => ({ });

MobileView.propTypes = {
  currentTownHall: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileView);