import React from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';

import AddOHEModal from './AddOHEModal';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import moment from 'moment';
import OHECard from './OHECard';
import routesHelper from '~/routesHelper';
import { Col, Button } from 'react-bootstrap';
import { getPropertyPath } from '~/routesHelper';

import './OHEManager.scss';

@inject('appStore', 'appProviders', 'router') @observer
class OHEManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddOheModal: false
    };
    autobind(this);
  }

  gotoPublishedListing() {
    return this.props.router.setRoute(getPropertyPath(this.props.listing));
  }

  toggleAddModal(showAddOheModal) {
    this.setState({ showAddOheModal });
  }

  showSharePopup() {
    const listing = this.props.listing;
    const listingUrl = `${location.protocol}//${location.hostname}${routesHelper.getPropertyPath(listing)}`;

    this.props.appProviders.modalProvider.showShareModal({
      shareUrl: listingUrl,
      title: 'ברכות, מועד ביקור חדש נקבע בהצלחה!',
      content: (
        <p>
          רוצים להגיע לעוד דיירים?
          <b> שתפו את המודעה</b>
          <br />
          ברשתות החברתיות והגיעו למקסימום דיירים במינימום זמן
        </p>
      )
    });
  }


  render() {
    const { listing, appStore, appProviders, router } = this.props;

    if (!appStore.authStore.isLoggedIn) {
      // This view will not be accessable by guest users and if a user got directed here directly (from email link) he should be given the login screen
      appProviders.authProvider.showLoginModal();
      return null;
    } else if (!appStore.listingStore.isListingPublisherOrAdmin(listing)) {
      router.goUpOneLevel();
      return null;
    }

    const openHouseEvents = appStore.oheStore.oheByListingId(listing.id);
    const isActiveListing = appProviders.listingsProvider.isActiveListing(listing);

    if (!openHouseEvents) {
      return <LoadingSpinner />;
    }

    const comingEvents = openHouseEvents.filter(event => (event.status !== 'inactive') && moment(event.end_time).isAfter(Date.now()));
    const passedEvents = openHouseEvents.filter(event => (event.status === 'inactive') || moment(event.end_time).isBefore(Date.now()));

    return (
      <Col xs={12} className="listing-events-container">
        {(isActiveListing && openHouseEvents.length === 0) ?
          <div className="listing-events-empty">
            <div className="listing-events-empty-title">
              הוסיפו מועד ביקור לדירה
            </div>
            <div className="listing-events-empty-subtitle">
              הוסיפו מועדי ביקור על מנת שדיירים פוטנציאלים יוכלו לבוא לראות את הדירה. 
            </div>
            <div>
              <Button className="listing-events-empty-preview-button"
                      onClick={this.gotoPublishedListing}>
                צפו במודעה שהעליתם
              </Button>
              <Button onClick={() => this.toggleAddModal(true)} className="listing-events-empty-add-button">הוסף מועד ביקור</Button>
            </div>
          </div>
        :
          <div>
            <div>
              {isActiveListing && <Button onClick={() => this.toggleAddModal(true)} className="add-button pull-left">הוסף מועד</Button>}
              <h3 className="listing-events-title">מועדי ביקור הבאים</h3>
            </div>
            <div className="listing-future-events">
              {comingEvents.length ?
                comingEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} editable={isActiveListing} />) :
                <h5 className="listing-events-no-ohe-title">אין ביקורים קרובים, הוסיפו מועדי ביקור על מנת שדיירים פוטנציאלים יוכלו לבוא לראות את הדירה</h5>}
            </div>
            <div>
              <h3 className="listing-events-title">מועדי ביקור שחלפו</h3>
            </div>
            <div>
              {passedEvents.length ?
                passedEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} />) :
                <h5 className="listing-events-no-ohe-title">אין ביקורים שחלפו</h5>}
            </div>
          </div>
        }
        <AddOHEModal listing={listing} show={this.state.showAddOheModal} onClose={(isOheCreated) => {
          this.toggleAddModal(false);
          if (isOheCreated) {
            this.showSharePopup();
          }
        }} />
      </Col>
    );
  }
}

OHEManager.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  router: React.PropTypes.object
};

export default OHEManager;
