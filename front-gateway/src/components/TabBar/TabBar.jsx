'use strict';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';

import './TabBar.scss';

@inject('router') @observer
export default class TabBar extends Component {

  constructor(props){
    super(props);
    this.activeKey = props.activeKey || '';
  }

  onChangeTab(activeTab) {
    this.activeKey = activeTab.key;
    this.props.onChangeTab(activeTab);
  }

  render() {
    return (
      <Navbar className="tab-bar">
        <Nav bsStyle="tabs" activeKey={this.activeKey}>
          {
            this.props.tabs.map(tab =>
            <NavItem key={tab.key} eventKey={tab.key} onClick={() => { this.onChangeTab(tab); }}>
              {tab.title}
            </NavItem>
          )}
        </Nav>
      </Navbar>
    );
  }
}

TabBar.wrappedComponent.propTypes = {
  tabs: React.PropTypes.array.isRequired,
  activeKey: React.PropTypes.string,
  onChangeTab: React.PropTypes.func
};
