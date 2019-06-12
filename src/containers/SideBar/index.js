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
        <Menu
          onClick={SideBar.handleClick}
          defaultSelectedKeys={
            [selectedKey]
          }
          mode="inline"
        >
        <Menu.Item key='subs' disabled className="meta-menu-item"><span id="submitted-meta-data"><span>You've submitted: </span><span id="submitted-total">0</span><span> event(s)</span></span></Menu.Item>
        <Menu.Divider></Menu.Divider>
          <MenuItemGroup key="federal-title" title="Enter events for federal lawmakers and candidates">
            <Menu.Item key="federal">Federal</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="state-title" title="Enter events for state legislators">
            {map(STATE_LEGS, (stateName, state) => (<Menu.Item key={state}>{stateName}</Menu.Item>))}
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
