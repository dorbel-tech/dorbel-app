'use strict';
import React from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem, NavDropdown, MenuItem, Navbar } from 'react-bootstrap';
import autobind from 'react-autobind';
import _ from 'lodash';

const tabs = [
  { relativeRoute: '', title: 'מודעת הדירה' },
  { relativeRoute: 'events', title: 'הרשמות למועדי ביקור' }
];

const listingStatusLabels = {
  pending: 'ממתינה לאישור',
  listed: 'מפורסמת',
  rented: 'הושכרה',
  unlisted: 'לא פעילה'
};

@observer(['appStore', 'appProviders', 'router'])
export default class ListingMenu extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  changeStatus(newStatus) {
    const { listing, appProviders } = this.props;
    appProviders.apartmentsProvider.updateListingStatus(listing.id, newStatus)
      .catch((resp) => {
        const fallbackNotificationData = {
          title: 'Error',
          message: 'Open House Event wasn\'t created'
        };
        this.props.appProviders.notificationProvider.error(resp, fallbackNotificationData);
      });
  }

  renderStatusSelector() {
    const { listing } = this.props;
    const currentStatus = listingStatusLabels[listing.status];
    const options = _.get(listing, 'meta.possibleStatuses') || [];

    return (
      <Nav bsStyle="tabs" onSelect={this.changeStatus} pullLeft>
        <NavDropdown title={currentStatus} id="nav-dropdown" disabled={options.length === 0}>
          {options.map(status => <MenuItem key={status} eventKey={status}>{listingStatusLabels[status]}</MenuItem>)}              
        </NavDropdown>
      </Nav>
    );
  }

  renderMenu() {
    const { currentAction } = this.props;
    const activeTab = _.find(tabs, { relativeRoute: currentAction }) || tabs[0];

    return (
      <Navbar className="in-page-nav">
        <Nav bsStyle="tabs" activeKey={activeTab.relativeRoute} onSelect={this.changeTab}>
          {tabs.map(tab => <NavItem key={tab.relativeRoute} eventKey={tab.relativeRoute}>{tab.title}</NavItem>)}
        </Nav>
        {this.renderStatusSelector()}
      </Navbar>
    );
  }
  
  changeTab(relativeRoute) {
    const { router, listing } = this.props;
    let actionRoute = relativeRoute ? `/${relativeRoute}` : '';
    router.setRoute(`/apartments/${listing.id}${actionRoute}`);
  }
  
  shouldMenuBeVisible() {
    const { appStore, listing } = this.props;
    const profile = appStore.authStore.getProfile();     
    const userIsListingPublisher = listing.publishing_user_id === profile.dorbel_user_id;
    const userIsAdmin = profile.role === 'admin';
    return userIsListingPublisher || userIsAdmin;
  }

  render() {
    return this.shouldMenuBeVisible() ? this.renderMenu() : null;
  }
  
}

ListingMenu.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object,
  router: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired,
  currentAction: React.PropTypes.string
};
