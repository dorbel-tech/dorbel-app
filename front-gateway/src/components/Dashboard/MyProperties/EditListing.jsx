import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Nav, NavItem, Navbar, Row, Grid, Col, Button } from 'react-bootstrap';
import ImageUpload from '~/components/ApartmentForm/ImageUpload/ImageUpload';
import ListingDetailsForm from '~/components/ApartmentForm/ListingDetailsForm/ListingDetailsForm';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';

const tabs = [
  { key: 'images', title: 'תמונות', component: ImageUpload },
  { key: 'details', title: 'פרטי דירה', component: ListingDetailsForm }
];

@observer(['appStore', 'appProviders'])
export default class EditListing extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = { activeTab: tabs[0] };
  }

  componentDidMount() {
    const { appStore, appProviders, listingId } = this.props;
    const listing = appStore.listingStore.get(listingId);

    // TEMP TEMP TEMP
    // Until this is integrated into actual dashboard then we expect to get listing in props
    if (listing) {
      appStore.editedListingStore.fillFromListing(listing);
    } else {
      appProviders.listingsProvider.loadFullListingDetails(listingId)
      .then(() => {
        appStore.editedListingStore.fillFromListing(appStore.listingStore.get(listingId));
      });
    }
  }

  save() {
    // let listing = this.props.appStore.editedListingStore.toListingObject();
    // return this.props.appProviders.listingsProvider.uploadApartment(listing)
  }

  render() {
    const { activeTab } = this.state;
    const { appStore, listingId } = this.props;

    return (
      <Row>
        <Navbar className="listing-menu-tabs">
          <Nav bsStyle="tabs" activeKey={activeTab.key} onSelect={tab => this.setState({ activeTab: tab })}>
            {tabs.map(tab =>
              <NavItem key={tab.key} eventKey={tab}>
                {tab.title}
              </NavItem>
            )}
          </Nav>
          <Navbar.Form pullLeft>
            <Button bsStyle="success" onClick={this.save} >שמור</Button>
            <Button bsStyle="danger">בטל</Button>
          </Navbar.Form>
        </Navbar>
        <Grid>
          { appStore.listingStore.get(listingId) ?
            <Row>
              <Col sm={10} smOffset={1}>
                <activeTab.component editedListingStore={this.props.appStore.editedListingStore} />
              </Col>
            </Row>
            : <div className="loader-container"><LoadingSpinner /></div>
          }
        </Grid>
      </Row>
    );
  }
}

EditListing.wrappedComponent.propTypes = {
  listingId: React.PropTypes.string,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
};

