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
  pending: { label: 'ממתינה לאישור', actionLabel: 'החזר את הדירה להמתנה' },
  listed: { label: 'מפורסמת', actionLabel: 'פרסם את הדירה' },
  rented: { label: 'הושכרה', actionLabel: 'הדירה הושכרה' },
  unlisted: { label: 'לא פעילה', actionLabel: 'השהה מודעה' }
};

@observer(['appStore', 'appProviders', 'router'])
export default class ListingMenu extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  changeStatus(newStatus) {
    const { listing, appStore, appProviders } = this.props;

    const openHouseEvents = appStore.oheStore.oheByListingId(listing.id);
    const listingHasActiveEvents = openHouseEvents.some(event => event.status !== 'expired');

    let confirmation = Promise.resolve(true);

    if (newStatus === 'rented' && listingHasActiveEvents) {
      confirmation = appProviders.modalProvider.showConfirmationModal({
        title: 'סימון הדירה כמושכרת',
        heading: 'השכרתם את הדירה? בשעה טובה!',
        body: 'שימו לב - למועדה זו מועדי ביקור פעילים. סימון הדירה כמושכרת יבטל את מועדי הביקור וישלח על כך עדכון לדיירים הרשומים, במידה וישנם.',
        confirmButton: 'הדירה הושכרה',
        confirmStyle: 'primary'
      });
    } else if (newStatus === 'unlisted' && listingHasActiveEvents) {
      confirmation = appProviders.modalProvider.showConfirmationModal({
        title: 'הפסקת פרסום המודעה',
        heading: 'ברצונכם לעצור את פרסום המודעה?',
        body: 'שימו לב - למועדה זו מועדי ביקור פעילים. השהיית המודעה תבטל את מועדי הביקור הקיימים ותשלח על כך עדכון לדיירים הרשומים, במידה וישנם.',
        confirmButton: 'השהה מודעה'
      });
    }

    confirmation.then(choice => {
      if (choice) {
        return appProviders.apartmentsProvider.updateListingStatus(listing.id, newStatus);
      }
    }).catch(this.props.appProviders.notificationProvider.error);
  }

  renderStatusSelector() {
    const { listing } = this.props;
    const currentStatus = listingStatusLabels[listing.status].label;
    const options = _.get(listing, 'meta.possibleStatuses') || [];

    return (
      <Nav bsStyle="tabs" onSelect={this.changeStatus} pullLeft>
        <NavDropdown title={currentStatus} id="nav-dropdown" disabled={options.length === 0}>
          {options.map(status => <MenuItem key={status} eventKey={status}>{listingStatusLabels[status].actionLabel}</MenuItem>)}
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
    const profile = appStore.authStore.profile;
    if (!profile) { return false; }

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
