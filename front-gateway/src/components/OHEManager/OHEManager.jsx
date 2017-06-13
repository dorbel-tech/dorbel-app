import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Button } from 'react-bootstrap';
import OHECard from './OHECard';
import AddOHEModal from './AddOHEModal';
import moment from 'moment';
import autobind from 'react-autobind';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ShareModal from '~/components/Modals/ShareModal/ShareModal';

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

  toggleAddModal(showAddOheModal) {
    this.setState({ showAddOheModal });
  }

  showSharePopup() {
    const listingUrl = `${location.protocol}//${location.hostname}/apartments/${this.props.listing.id}`;
    
    this.props.appProviders.modalProvider.showInfoModal({
      body: <ShareModal
        shareUrl={listingUrl}
        title="ברכות, מועד ביקור חדש נקבע בהצלחה!"
        heading="רוצים להגיע לעוד דיירים? "
        headingBold="שתפו את המודעה!"
        content="שתפו את מודעת הדירה ברשתות החברתיות והגיעו למקסימום דיירים במינימום זמן"
      />,
      modalSize: ShareModal.modalSize
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
        <div>
          {isActiveListing && <Button onClick={() => this.toggleAddModal(true)} className="add-button pull-left">הוסף מועד</Button>}
          <h3 className="listing-events-title">מועדי ביקור הבאים</h3>
        </div>
        <div>
          {comingEvents.length ?
            comingEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} editable={isActiveListing} />) :
            <h5 className="listing-events-no-ohe-title">אין ביקורים קרובים</h5>}
        </div>
        <div>
          <h3 className="listing-events-title">מועדי ביקור שחלפו</h3>
        </div>
        <div>
          {passedEvents.length ?
            passedEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} />) :
            <h5 className="listing-events-no-ohe-title">אין ביקורים שחלפו</h5>}
        </div>
        <AddOHEModal listing={listing} show={this.state.showAddOheModal} onClose={(val) => {
          this.toggleAddModal(false);
          if (val) {
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
