import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Nav, NavItem, Navbar, Row, Grid, Col, Button } from 'react-bootstrap';
import ImageUpload from '~/components/ApartmentForm/ImageUpload/ImageUpload';
import EditListingForm from './EditListingForm';

const tabs = [
  { key: 'images', title: 'תמונות', component: ImageUpload },
  { key: 'details', title: 'פרטי דירה', component: EditListingForm }
];

@inject('appStore', 'appProviders', 'router') @observer
export default class EditListing extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = { activeTab: tabs[0] };
  }

  componentWillMount() {
    const { appStore, listing } = this.props;
    appStore.editedListingStore.loadListing(listing);
  }

  gotoMyProperty() {
    this.props.router.setRoute('/dashboard/my-properties/' + this.props.listing.id);
  }

  save() {
    const { listing, appStore, appProviders } = this.props;
    const patch = appStore.editedListingStore.toListingObject();
    return appProviders.listingsProvider.updateListing(listing.id, patch)
    .then(() => {
      appProviders.notificationProvider.success('הדירה עודכנה בהצלחה');
      this.gotoMyProperty();
    })
    .catch(err => {
      appProviders.notificationProvider.error(err);
      throw err;
    });
  }

  cancel() {
    this.gotoMyProperty();
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
        <Row className="property-content-container property-edit-container">
          <Grid fluid>
            <Col sm={12}>
              <activeTab.component editedListingStore={this.props.appStore.editedListingStore}/>
              <Row className="property-edit-actions-mobile pull-left">
                <Button bsStyle="success" onClick={this.save}>שמור</Button>
                <Button onClick={this.cancel}>בטל</Button>
              </Row>
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

