import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Tabs, Tab, Row, Grid, Col, Button } from 'react-bootstrap';
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
    const { editedListingStore } = this.props.appStore;

    return (
      <div>
        <Tabs className="tab-menu" activeKey={activeTab}
              onSelect={(tab) => this.setState({ activeTab: tab })} id="edit-listing-tabs">
          {tabs.map(tab =>
            <Tab eventKey={tab} key={tab.key} title={tab.title}></Tab>
          )}
        </Tabs>
        <Row className="property-content-container property-edit-container">
          <Grid fluid>
            <Col xs={12} sm={12} lg={10} lgOffset={1}>
              <activeTab.component editedListingStore={editedListingStore}/>
              <Row className="property-edit-actions-mobile pull-left">
                <Button bsStyle="success" onClick={this.save} disabled={editedListingStore.disableSave}>שמור</Button>
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
  router: React.PropTypes.object.isRequired
};

