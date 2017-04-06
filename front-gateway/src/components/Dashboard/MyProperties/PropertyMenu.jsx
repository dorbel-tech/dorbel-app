'use strict';
import React from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import _ from 'lodash';

@observer(['router'])
export default class PropertyMenu extends React.Component {
  render() {
    const { currentTab, property, tabs, router } = this.props;
    const activeTab = _.find(tabs, { relativeRoute: currentTab }) || tabs[0];

    return (
      <Navbar className="property-menu tab-menu">
        <Nav bsStyle="tabs" activeKey={activeTab.relativeRoute}
             onSelect={(relativeRoute) => {router.setRoute('/dashboard/my-properties/' + property.id + '/' + relativeRoute);}}>
          {tabs.map(tab =>
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
  currentTab: React.PropTypes.string,
  property: React.PropTypes.object.isRequired,
  tabs: React.PropTypes.array
};
