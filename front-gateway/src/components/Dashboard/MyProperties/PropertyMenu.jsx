'use strict';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';

@inject('router') @observer
export default class PropertyMenu extends React.Component {
  render() {
    const { activeKey, path, tabs, router } = this.props;

    return (
      <Navbar className="property-menu tab-menu">
        <Nav bsStyle="tabs" activeKey={activeKey}
             onSelect={(relativeRoute) => {router.setRoute(path + relativeRoute);}}>
          {tabs.filter(tab => !tab.hideFromMenu).map(tab =>
            <NavItem key={tab.relativeRoute} eventKey={tab.relativeRoute}>
              {tab.title}
            </NavItem>
          )}
        </Nav>
      </Navbar>
    );
  }
}

PropertyMenu.wrappedComponent.propTypes = {
  router: React.PropTypes.object,
  activeKey: React.PropTypes.string,
  path: React.PropTypes.string.isRequired,
  tabs: React.PropTypes.array
};
