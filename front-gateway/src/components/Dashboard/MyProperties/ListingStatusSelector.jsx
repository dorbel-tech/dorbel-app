import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import autobind from 'react-autobind';
import utils from '~/providers/utils';

const listingStatusLabels = utils.getListingStatusLabels();

@inject('appStore', 'appProviders') @observer
class ListingStatusSelector extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  changeStatus(newStatus) {
    const { listing, appStore, appProviders } = this.props;

    const openHouseEvents = appStore.oheStore.oheByListingId(listing.id);
    const listingHasActiveEvents = openHouseEvents.some(event => ['inactive', 'expired'].indexOf(event.status) == -1);

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
        return appProviders.listingsProvider.updateListingStatus(listing.id, newStatus);
      }
    }).catch((err) => this.props.appProviders.notificationProvider.error(err));
  }

  render() {
    const { listing } = this.props;
    const currentStatus = listingStatusLabels[listing.status].label;
    const options = _.get(listing, 'meta.possibleStatuses') || [];

    return (
      <div className="listing-status-container">
        <span className="listing-status-label">סטטוס המודעה:</span>
        <DropdownButton id="listing-status-selector"
          className="listing-status-selector"
          disabled={options.length === 0}
          title={currentStatus}
          onSelect={this.changeStatus}>
          {options.map(status => <MenuItem id={status} key={status} eventKey={status}>{listingStatusLabels[status].actionLabel}</MenuItem>)}
        </DropdownButton>
      </div>
    );
  }
}

ListingStatusSelector.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingStatusSelector;
