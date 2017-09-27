import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';

import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';
import ListingStatusSelector from '~/components/Dashboard/MyProperties/ListingStatusSelector';
import DocumentRow from '~/components/Documents/DocumentRow';
import DocumentUpload from '~/components/Documents/DocumentUpload';
import NavLink from '~/components/NavLink';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import { PROPERTY_SUBMIT_PREFIX } from '~/routesHelper';

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

  renderListingHeader(listing) {
    const { appProviders } = this.props;
    const images = appProviders.utils.sortListingImages(listing);

    return (
      <ListGroupItem className="my-documents-listing-header">
        <Row>
          <Col xs={6} sm={4} className="my-documents-listing-image-container">
            <CloudinaryImage src={images[0].url} className="my-documents-listing-image" />
          </Col>
          <Col xs={6} sm={8} className="my-documents-listing-info">
            <span className="my-document-listing-title">{this.getListingTitle(listing)}</span>
            <div className="my-documents-listing-details" >
              <div className="my-documents-listing-details-sub">
                <span className="gray-mid-light-text">דירה</span>
                &nbsp;{listing.apartment.apt_number}
              </div>
              <div className="my-documents-listing-details-sub">
                {listing.apartment.size}&nbsp;
                <span className="gray-mid-light-text">מ"ר</span>
              </div>
            </div>
            <div className="my-documents-listing-status">
              { !appProviders.utils.isMobile() && <ListingStatusSelector listing={listing} disabled={true} /> }
            </div>
          </Col>
        </Row>
      </ListGroupItem>
    );
  }

  renderListingStatus(listing) {
    return (
      <ListGroupItem>
        <Row>
          <Col xs={5} className="gray-mid-light-text">
            סטטוס המודעה :
          </Col>
          <Col xs={7} className="my-documents-listing-status">
            <ListingStatusSelector listing={listing} disabled={true} />
          </Col>
        </Row>
      </ListGroupItem>
    );
  }

  renderListingSubHeader(documents, listing) {
    const upload = <DocumentUpload className="add-button my-documents-add-document" bsSize="xsmall" listing_id={listing.id}/>;

    let subHeaderContent = (
      <Row>
        <Col xs={6} className="gray-mid-light-text">אין מסמכים שמורים</Col>
        <Col xs={6}>{upload}</Col>
      </Row>
    );

    if (documents.length > 0) {
      subHeaderContent = (
        <Row className="gray-mid-light-text">
          <Col xs={6} sm={7}>שם מסמך</Col>
          <Col xsHidden sm={2}>תאריך העלאה</Col>
          <Col xsHidden sm={1}>גודל</Col>
          <Col xs={6} sm={2}>{upload}</Col>
        </Row>
      );
    }

    return <ListGroupItem className="my-documents-listing-sub-header">{subHeaderContent}</ListGroupItem>;
  }

  renderListing(listing) {
    const { appStore, appProviders } = this.props;
    const documents = appStore.documentStore.getDocumentsByListing(listing.id);

    return (
      <ListGroup key={listing.id}>
        {this.renderListingHeader(listing)}
        {appProviders.utils.isMobile() && this.renderListingStatus(listing)}
        {this.renderListingSubHeader(documents, listing)}
        { documents.map(doc =>
          <ListGroupItem key={doc.id}>
            <DocumentRow document={doc} />
          </ListGroupItem>
        )}
      </ListGroup>
    );
  }

  renderNoListings() {
    return (
      <Row>
        <Col xs={12} lg={4} sm={6}>
          <div className="my-properties-empty">
            <NavLink className="my-properties-add" to={PROPERTY_SUBMIT_PREFIX}>
              <div className="my-properties-cross">
                <img src="https://static.dorbel.com/images/dashboard/add-property-icon.svg" />
              </div>
              <div className="my-properties-title">הוסיפו נכס</div>
            </NavLink>
            <div className="my-properties-text">אין לכם נכסים קיימים. הוסיפו נכס בבעלותכם או את הדירה בה אתם גרים.</div>
          </div>
        </Col>
      </Row>
    );
  }

  render() {
    const { searchStore } = this.props.appStore;
    const listings = searchStore.searchResults();

    let contents = <LoadingSpinner />;
    if (!searchStore.isLoadingNewSearch && !listings.length) {
      contents = this.renderNoListings();
    } else if (!searchStore.isLoadingNewSearch && listings.length) {
      contents = listings.map(this.renderListing);
    }

    return (
      <Grid fluid className="my-documents-container">
        <Row>
          <Col xs={12}><h4>מסמכים</h4></Col>
        </Row>
        { contents }
      </Grid>
    );
  }
}
