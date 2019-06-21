import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import { Layout, Tooltip, Menu, Icon, notification } from 'antd';
import {
  getTownHall,
} from '../../state/townhall/selectors';
import thpLogo from "../../assets/images/THP_logo_horizontal_simple.png";
const {
  Header,
} = Layout;

import './style.scss';

const openNotification = () => {
  notification.open({
    message: 'Having trouble?',
    description:
      `Email: info@townhallproject.com`,
  });
};

class PageHeader extends React.Component {
  static replacer(key, value) {
    // Filtering out properties
    if (!value || value.length === 0) {
      return undefined;
    }
    return value;
  }
  constructor(props) {
    super(props);
  }
  render() {
    const {
      currentTownHall,
    } = this.props;
    const openDataObject = () => {
      notification.open({
        message: 'Current Event Object',
        description:
          <pre className="language-bash" style={{ overflow: 'scroll', maxHeight: '80vh', textAlign: 'left' }}>
            {
              JSON.stringify(currentTownHall, PageHeader.replacer, 2)
            }
          </pre>,
      });
    };
    return (
      <Header className="header" style={{ background: '#fff', padding: 0 }}>
        <img className="thp-logo" src={thpLogo} />
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px', float: 'right' }}
          className="header-menu"
        >
          <Menu.Item key="info" onClick={openNotification}><Tooltip title="Help"><Icon type="question-circle" /></Tooltip></Menu.Item>
          <Menu.Item key="code" onClick={openDataObject}><Tooltip title="Data Object"><Icon type="code" /></Tooltip></Menu.Item>
        </Menu>
      </Header>
    );
  }
}

const mapStateToProps = state => ({
  currentTownHall: getTownHall(state),
});

const mapDispatchToProps = dispatch => ({});

PageHeader.propTypes = {
  currentTownHall: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
