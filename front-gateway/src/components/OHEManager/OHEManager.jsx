import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import OHECard from './OHECard';
import AddOHEModal from './AddOHEModal';

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
    const { listing } = this.props;
    const openHouseEvents = this.props.appStore.oheStore.oheByListingId(listing.id);        

    return (
      <Grid fluid={true} className="apt-info-container">
        <Col xs={10} xsOffset={1} >
          <Row>
            <span>מועדי ביקור הבאים</span>
            <Button onClick={() => this.toggleAddModal(true)} className="pull-left">+ הוסף מועד</Button>
          </Row>
          <Row>
            {openHouseEvents.map(ohe => <OHECard key={ohe.id} ohe={ohe} />)}
          </Row>
        </Col>
        <AddOHEModal listing={listing} show={this.state.showAddOheModal} onClose={() => this.toggleAddModal(false)}/>
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
