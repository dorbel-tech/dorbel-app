import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Grid, Row, Col, ListGroup, ListGroupItem, Checkbox } from 'react-bootstrap';

import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';
import ListingStatusSelector from '~/components/Dashboard/MyProperties/ListingStatusSelector';
import DocumentRow from '~/components/Documents/DocumentRow';
import DocumentUpload from '~/components/Documents/DocumentUpload';

import './MyDocuments.scss';

@inject('appStore', 'appProviders') @observer
export default class MyDocuments extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    appStore: React.PropTypes.object.isRequired,
    appProviders: React.PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.appStore.searchStore.reset();
    this.props.appProviders.searchProvider.search({ myProperties: true });
    this.props.appProviders.documentProvider.getAllDocumentsForUser();
  }

  getListingTitle(listing) {
    const house_number = listing.apartment.building.house_number ? (' ' + listing.apartment.building.house_number) : '';
    return `דירת ${listing.apartment.rooms} חד' ב${listing.apartment.building.street_name}${house_number}, ${listing.apartment.building.city.city_name}`;
  }

  renderListing(listing) {
    const { appStore, appProviders } = this.props;
    const documents = appStore.documentStore.getDocumentsByListing(listing.id);
    const images = appProviders.utils.sortListingImages(listing);

    return (
      <Row key={listing.id}>
        <ListGroup>
          <ListGroupItem className="my-documents-listing-header">
            <Row>
              <Col xs={3}>
                <CloudinaryImage src={images[0].url} className="my-documents-listing-image" />
                <ListingStatusSelector listing={listing} />
              </Col>
              <Col xs={3}>
                {this.getListingTitle(listing)}                
              </Col>
              <Col xs={1}>
                {listing.apartment.size}&nbsp;
                <span className="gray-mid-light-text">מ"ר</span>
              </Col>
              <Col xs={1}>
                <span className="gray-mid-light-text">דירה</span>
                &nbsp;{listing.apartment.apt_number}
              </Col>
            </Row>
          </ListGroupItem>

          <ListGroupItem className="my-documents-listing-sub-header">
            <Row>
              <Col xs={1} className="text-center"><Checkbox checked={false} disabled /></Col>
              <Col xs={2}>שם מסמך</Col>
              <Col xs={4}><DocumentUpload type="link" listing_id={listing.id}/></Col>
              <Col xs={2}>תאריך העלאה</Col>
              <Col xs={2}>גודל</Col>
            </Row>
          </ListGroupItem>

          { documents.map(doc => 
            <ListGroupItem key={doc.id}>
              <DocumentRow document={doc} />
            </ListGroupItem>
          )}
        </ListGroup>
      </Row>
    );
  }

  render() {
    const listings = this.props.appStore.searchStore.searchResults();

    return (
      <Grid fluid className="my-documents-container">
        <Row>
          <Col xs={11}>מסמכים</Col>
          <Col xs={1}>חיפוש</Col>
        </Row>
        {listings.map(this.renderListing)}
      </Grid>
    );
  }
}
