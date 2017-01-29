import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import OHECard from './OHECard';
import AddOHEModal from './AddOHEModal';
import moment from 'moment';

import autobind from 'react-autobind';

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
    const user = appStore.authStore.profile;

    if (!appStore.authStore.isLoggedIn) {
      // This view will not be accessable by guest users and if a user got directed here directly (from email link) he should be given the login screen
      appProviders.authProvider.showLoginModal();
      return null;
    } else if (user.dorbel_user_id !== listing.publishing_user_id && user.role !== 'admin') {
      router.goUpOneLevel();
      return null;
    }

    const openHouseEvents = this.props.appStore.oheStore.oheByListingId(listing.id);

    const comingEvents = openHouseEvents.filter(event => moment(event.end_time).isAfter(Date.now()));
    const passedEvents = openHouseEvents.filter(event => moment(event.end_time).isBefore(Date.now()));

    return (
      <Grid fluid={true} className="apt-info-container">
        <Col xs={10} xsOffset={1} >
          <Row>
            <Button onClick={() => this.toggleAddModal(true)} className="pull-left">הוסף מועד +</Button>
            <h3>מועדי ביקור הבאים</h3>
          </Row>
          <Row>
            {comingEvents.length ?
              comingEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} editable={true} />) :
              <h4>אין ביקורים קרובים</h4>}
          </Row>
          <Row>
            <h3>מועדי ביקור שחלפו</h3>
          </Row>
          <Row>
            {passedEvents.length ?
              passedEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} />) :
              <h4>אין ביקורים שחלפו</h4>}
          </Row>
        </Col>
        <AddOHEModal listing={listing} show={this.state.showAddOheModal} onClose={() => this.toggleAddModal(false)} />
      </Grid>
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
