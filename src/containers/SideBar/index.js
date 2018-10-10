import React from 'react';
import {
    connect,
} from 'react-redux';
import {
    Menu,
    Icon,
} from 'antd';

import {
    setUsState,
} from '../../state/selections/actions';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        const {
            handleSetUSState,
        } = this.props;
        const {
            key,
        } = e
        console.log('click ', handleSetUSState);
        if (key === 'federal') {
            handleSetUSState(null)
        } else {
            handleSetUSState(key)
        }
    }
    
    render() {
        return (
        <section className="session-data">
          <h4>Welcome</h4>
          <small>Having trouble? Email info@townhallproject.com</small>
          <p id="submitted-meta-data" className="hidden"><span>You've submitted: </span><span id="submitted-total" >0</span><span> event(s)</span></p>
          <p id="submit-success" className="hidden text-success">Thank you for submitting an event!</p>
          <ul id="submitted" className="list-group events-table">
          </ul>
  
            <Menu
                onClick={this.handleClick}
                defaultSelectedKeys = {
                    ['federal']
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
        )
    }
}

const mapStateToProps = state => ({


});

const mapDispatchToProps = dispatch => ({
    handleSetUSState: usState => dispatch(setUsState(usState)),
  
});

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
