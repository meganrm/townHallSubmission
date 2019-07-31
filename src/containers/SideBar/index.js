/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  Menu,
} from 'antd';
import { map } from 'lodash';

import page from '../../vendor/scripts/page';

import {
  setUsState,
} from '../../state/selections/actions';
import { getSelectedUSState } from '../../state/selections/selectors';
import { STATE_LEGS } from '../../constants';
import './style.scss';
import { getEventCount } from '../../state/user/selectors';

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
    const {
      currentUsState,
      eventCount,
    } = this.props;
    const selectedKey = currentUsState || 'federal';
    return (
      <section className="session-data">
        <Menu
          onClick={SideBar.handleClick}
          defaultSelectedKeys={
            [selectedKey]
          }
          mode="inline"
        >
          <Menu.Item key="subs" disabled className="meta-menu-item">
            <span id="submitted-meta-data">
              <span>You've submitted: </span>{eventCount}
              <span> event(s)</span>
            </span>
          </Menu.Item>
          <Menu.Divider />
          <MenuItemGroup key="federal-title" title="Enter events for FEDERAL lawmakers/candidates">
            <Menu.Item key="federal">Federal</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="state-title" title="Enter events for STATE lawmakers/candidates">
            {map(STATE_LEGS, (stateName, state) => (<Menu.Item key={state}>{stateName}</Menu.Item>))}
          </MenuItemGroup>
        </Menu>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  currentUsState: getSelectedUSState(state),
  eventCount: getEventCount(state),
});

const mapDispatchToProps = dispatch => ({
  handleSetUSState: usState => dispatch(setUsState(usState)),
});

SideBar.propTypes = {
  currentUsState: PropTypes.string,
  eventCount: PropTypes.number.isRequired,
};

SideBar.defaultProps = {
  currentUsState: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
