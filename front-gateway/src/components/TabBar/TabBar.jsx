'use strict';
import React from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';

import './TabBar.scss';

@observer(['router'])
export default class ListingMenu extends React.Component {

  onClick(activeTab) {
    this.setState({activeTabName: activeTab.name});
    this.props.onClick(activeTab);
  }

  render() {
    return (
      <Navbar className="tab-bar">
        <Nav bsStyle="tabs" onSelect={this.changeTab}>
          {this.props.tabs.map(tab =>
            <NavItem className={tab.isActive ? 'active' : ''} key={tab.title} onClick={() => { this.onClick(tab); }}>
              {tab.title}
            </NavItem>
          )}
        </Nav>
      </Navbar>
    );
  }
}

ListingMenu.wrappedComponent.propTypes = {
  tabs: React.PropTypes.array.isRequired,
  onClick: React.PropTypes.func
};
