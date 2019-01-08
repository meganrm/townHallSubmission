/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  Menu,
} from 'antd';
import page from '../../vendor/scripts/page';

import {
  setUsState,
} from '../../state/selections/actions';
import { getSelectedUSState } from '../../state/selections/selectors';

const MenuItemGroup = Menu.ItemGroup;

class SideBar extends React.Component {
  static handleClick(e) {
    const {
      key,
    } = e;
    if (key === 'federal') {
      page('/');
    } else {
      page(`/${key}`);
    }
  }

  render() {
    const { currentUsState } = this.props;
    const selectedKey = currentUsState || 'federal';
    return (
      <section className="session-data">
        <h4>Welcome</h4>
        <small>Having trouble? Email info@townhallproject.com</small>
        <p id="submitted-meta-data" className="hidden"><span>You've submitted: </span><span id="submitted-total">0</span><span> event(s)</span></p>
        <p id="submit-success" className="hidden text-success">Thank you for submitting an event!</p>
        <ul id="submitted" className="list-group events-table" />
        <Menu
          onClick={SideBar.handleClick}
          defaultSelectedKeys={
            [selectedKey]
          }
          mode="inline"
        >
          <MenuItemGroup key="federal-title" title="Enter events for Congress">
            <Menu.Item key="federal">Federal</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="state-title" title="Enter events for state legislators">
            <Menu.Item key="AZ">Arizona</Menu.Item>
            <Menu.Item key="VA">Virginia</Menu.Item>
            <Menu.Item key="NC">North Carolina</Menu.Item>
            <Menu.Item key="CO">Colorado</Menu.Item>
          </MenuItemGroup>
        </Menu>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  currentUsState: getSelectedUSState(state),
});

const mapDispatchToProps = dispatch => ({
  handleSetUSState: usState => dispatch(setUsState(usState)),
});

SideBar.propTypes = {
  currentUsState: PropTypes.string,
};

SideBar.defaultProps = {
  currentUsState: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
