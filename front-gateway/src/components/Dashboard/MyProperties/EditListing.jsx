import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Nav, NavItem, Navbar, Row, Grid, Col, Button } from 'react-bootstrap';
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
    let listing = this.props.appStore.editedListingStore.toListingObject();
    return this.props.appProviders.listingsProvider.updateListing(listing);
  }

  render() {
    const { activeTab } = this.state;

    return (
      <Grid fluid>
        <Row>
          <Navbar className="property-menu tab-menu">
            <Nav bsStyle="tabs" activeKey={activeTab} onSelect={tab => this.setState({ activeTab: tab })}>
              {tabs.map(tab =>
                <NavItem key={tab.key} eventKey={tab}>
                  {tab.title}
                </NavItem>
              )}
            </Nav>
          </Navbar>
        </Row>
        <Row>
          <Grid fluid className="property-stats">
            <activeTab.component editedListingStore={this.props.appStore.editedListingStore} />
          </Grid>
        </Row>
      </Grid>
    );
  }
}

EditListing.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
};

