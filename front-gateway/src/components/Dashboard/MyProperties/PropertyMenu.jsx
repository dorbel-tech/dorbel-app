'use strict';
import React from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import autobind from 'react-autobind';
import _ from 'lodash';

const tabs = [
  { relativeRoute: 'stats', title: 'סטטיסטיקות' },
  { relativeRoute: 'ohe', title: 'מועדי ביקור' }
];

@observer(['router'])
export default class PropertyMenu extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  changeTab(relativeRoute) {
    const { router, property } = this.props;
    let actionRoute = relativeRoute ? `/${relativeRoute}` : '';
    router.setRoute(`/dashboard/my-properties/${property.id}${actionRoute}`);
  }

  render() {
    const { currentAction } = this.props;
    const activeTab = _.find(tabs, { relativeRoute: currentAction }) || tabs[0];

    return (
      <Navbar className="property-menu tab-menu">
        <Nav bsStyle="tabs" activeKey={activeTab.relativeRoute} onSelect={this.changeTab}>
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
  property: React.PropTypes.object.isRequired,
  currentAction: React.PropTypes.string
};
