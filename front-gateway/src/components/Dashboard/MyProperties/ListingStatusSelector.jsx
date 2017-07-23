import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { DropdownButton, MenuItem, Button } from 'react-bootstrap';
import autobind from 'react-autobind';
import utils from '~/providers/utils';
import { getDashMyPropsPath } from '~/routesHelper';

import './ListingStatusSelector.scss';

const listingStatusLabels = utils.getListingStatusLabels();

@inject('appStore', 'appProviders') @observer
class ListingStatusSelector extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  getListingActiveEvents() {
    const { listing, appStore } = this.props;
    const openHouseEvents = appStore.oheStore.oheByListingId(listing.id);
    let listingHasActiveEvents = false;

    if (openHouseEvents) {
      listingHasActiveEvents = openHouseEvents.some(event => ['inactive', 'expired'].indexOf(event.status) == -1);
    }

    return listingHasActiveEvents;
  }

  changeStatus(newStatus) {
    const { listing, appProviders } = this.props;
    const listingHasActiveEvents = this.getListingActiveEvents();

    let confirmation = Promise.resolve(true);

    if (newStatus === 'republish') {
      return appProviders.listingsProvider.republish(listing);
    } else if (newStatus === 'rented' && listingHasActiveEvents) {
      confirmation = appProviders.modalProvider.showConfirmationModal({
        title: 'סימון הדירה כמושכרת',
        heading: 'השכרתם את הדירה? בשעה טובה!',
        body: <p>שימו לב - למועדה זו מועדי ביקור פעילים. סימון הדירה כמושכרת יבטל את מועדי הביקור וישלח על כך עדכון לדיירים הרשומים, במידה וישנם.</p>,
        confirmButton: 'הדירה הושכרה',
        confirmStyle: 'primary'
      });
    } else if (newStatus === 'unlisted' && listingHasActiveEvents) {
      confirmation = appProviders.modalProvider.showConfirmationModal({
        title: 'הפסקת פרסום המודעה',
        heading: 'ברצונכם לעצור את פרסום המודעה?',
        body: <p>שימו לב - למועדה זו מועדי ביקור פעילים. השהיית המודעה תבטל את מועדי הביקור הקיימים ותשלח על כך עדכון לדיירים הרשומים, במידה וישנם.</p>,
        confirmButton: 'השהה מודעה'
      });
    }

    confirmation.then(choice => {
      if (choice) {
        return appProviders.listingsProvider.updateListingStatus(listing.id, newStatus)
          .then(() => {
            appProviders.notificationProvider.success('סטטוס הדירה עודכן בהצלחה');
            this.postStatusChange(newStatus);
          });
      }
    }).catch((err) => this.props.appProviders.notificationProvider.error(err));
  }

  postStatusChangeAction(rentLeadBy) {
    const { listing, appProviders } = this.props;

    appProviders.listingsProvider.updateListing(listing.id, { rent_lead_by: rentLeadBy });

    appProviders.modalProvider.close();
    appProviders.navProvider.setRoute(getDashMyPropsPath(listing, '/manage'));
  }

  postStatusChange(newStatus) {
    const { appProviders } = this.props;

    if (newStatus === 'rented') {
      appProviders.modalProvider.showInfoModal({
        title: <div className="rented-congrats-modal-title">ברכות על השכרת הדירה!</div>,
        body: <div>
          <h4 className="rented-congrats-modal-text">האם מצאת את הדיירים החדשים שלך באמצעות dorbel?</h4>
          <Button onClick={() => this.postStatusChangeAction('dorbel')} className="rented-congrats-modal-button" bsStyle="info">כן! תודה לכם</Button>
          <Button onClick={() => this.postStatusChangeAction('other')} className="rented-congrats-modal-button" bsStyle="primary">לצערי לא</Button>
        </div>,
        footer: <div className="text-center">
          מה הלאה? המשיכו לעמוד הניהול בחשבון הנכס שלכם והוסיפו את פרטי הקשר של הדיירים
        </div>,
        modalSize: 'small'
      });
    }
  }

  render() {
    const { listing, appProviders } = this.props;
    const currentStatusLabel =
      listingStatusLabels[listing.status].landlordLabel || listingStatusLabels[listing.status].label;

    let options = _.get(listing, 'meta.possibleStatuses') || [];
    options = options.filter(status => (status !== listing.status) && (listingStatusLabels[status].hasOwnProperty('actionLabel')));
    if (appProviders.listingsProvider.isRepublishable(listing)) {
      options = options.concat(['republish']);
    }

    return (
      <DropdownButton id="listing-status-selector" noCaret
        className={'listing-status-selector listing-status-selector-' + listing.status}
        disabled={this.props.disabled || options.length === 0}
        title={currentStatusLabel}
        onSelect={this.changeStatus}>
        {options.map(status => <MenuItem id={status} key={status} eventKey={status} className={'listing-status-selector-item-' + status}>{listingStatusLabels[status].actionLabel}</MenuItem>)}
      </DropdownButton>
    );
  }
}

ListingStatusSelector.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired,
  disabled: React.PropTypes.bool
};

export default ListingStatusSelector;
