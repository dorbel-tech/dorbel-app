import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import OHECard from './OHECard';
import AddOHEModal from './AddOHEModal';
import moment from 'moment';
import autobind from 'react-autobind';

import './OHEManager.scss';

@observer(['appStore', 'appProviders', 'router'])
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

    const openHouseEvents = this.props.appStore.oheStore.oheByListingId(listing.id);

    const comingEvents = openHouseEvents.filter(event => moment(event.end_time).isAfter(Date.now()));
    const passedEvents = openHouseEvents.filter(event => moment(event.end_time).isBefore(Date.now()));

    return (
      <Col xs={12} className="listing-events-container">
        <div>
          <Button onClick={() => this.toggleAddModal(true)} className="listing-events-add-ohe pull-left">הוסף מועד +</Button>
          <h3>מועדי ביקור הבאים</h3>
        </div>
        <div>
          {comingEvents.length ?
            comingEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} editable={true} />) :
            <h5 className="listing-events-no-ohe-title">אין ביקורים קרובים</h5>}
        </div>
        <div>
          <h3>מועדי ביקור שחלפו</h3>
        </div>
        <div>
          {passedEvents.length ?
            passedEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} />) :
            <h5 className="listing-events-no-ohe-title">אין ביקורים שחלפו</h5>}
        </div>
        <AddOHEModal listing={listing} show={this.state.showAddOheModal} onClose={() => this.toggleAddModal(false)} />
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
