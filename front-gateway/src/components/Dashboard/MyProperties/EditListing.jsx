import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Nav, NavItem, Navbar, Row, Grid, Col } from 'react-bootstrap';
import ImageUpload from '~/components/ApartmentForm/ImageUpload/ImageUpload';
import ListingDetailsForm from '~/components/ApartmentForm/ListingDetailsForm/ListingDetailsForm';

const tabs = [
  { key: 'images', title: 'תמונות', component: ImageUpload },
  { key: 'details', title: 'פרטי דירה', component: ListingDetailsForm }
];

@inject('appStore', 'appProviders') @observer
export default class EditListing extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = { activeTab: tabs[0] };
  }

  componentDidMount() {
    const { appStore, listing } = this.props;
    appStore.editedListingStore.fillFromListing(listing);
  }

  save() {
    const { listing, appStore } = this.props;
    const patch = appStore.editedListingStore.toListingObject();
    return this.props.appProviders.listingsProvider.updateListing(listing.id, patch);
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div>
        <Navbar className="property-menu tab-menu">
          <Nav bsStyle="tabs" activeKey={activeTab} onSelect={tab => this.setState({ activeTab: tab })}>
            {tabs.map(tab =>
              <NavItem key={tab.key} eventKey={tab}>
                {tab.title}
              </NavItem>
            )}
          </Nav>
        </Navbar>
        <Row className="property-content-container">
          <Grid fluid>
            <Col sm={12}>
              <activeTab.component editedListingStore={this.props.appStore.editedListingStore} />
            </Col>
          </Grid>
        </Row>
      </div>
    );
  }
}

EditListing.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
};

