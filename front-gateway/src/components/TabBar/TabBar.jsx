'use strict';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';

import './TabBar.scss';

@observer(['router'])
export default class TabBar extends Component {

  onChangeTab(activeTab) {
    this.props.tabs.map((tab) => { tab.isActive = (tab.name == activeTab.name); });
    this.props.onChangeTab(activeTab);
  }

  render() {
    return (
      <Navbar className="tab-bar">
        <Nav bsStyle="tabs">
          {this.props.tabs.map(tab =>
            <NavItem className={tab.isActive ? 'active' : ''} key={tab.title} onClick={() => { this.onChangeTab(tab); }}>
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
  onChangeTab: React.PropTypes.func
};
