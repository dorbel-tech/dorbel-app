'use strict';
import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Row } from 'react-bootstrap';
import utils from '~/providers/utils';
import NavLink from '~/components/NavLink';
import ListingBadge from '~/components/ListingBadge/ListingBadge';
import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';

let Flickity = 'div';
let carouselClass = 'fixed-carousel';

if (process.env.IS_CLIENT) {
  Flickity = require('react-flickity-component')(React);
  carouselClass = 'carousel';
}

const flickityOptions = {
  cellAlign: 'left',
  contain: true,
  pageDots: false
};

@observer(['appStore'])
export default class ListingHeader extends React.Component {
  render() {
    const { appStore, listing } = this.props;
    const sortedListingImages = utils.sortListingImages(listing);
    const isListingPublisherOrAdmin = listing ? appStore.listingStore.isListingPublisherOrAdmin(listing) : false;

    return (
      <header className="listing-header">
        {isListingPublisherOrAdmin ?
          <NavLink className="listing-header-to-dashboard"
                   to={'/dashboard/my-properties/' + listing.id}>
            לניהול הנכס
          </NavLink>
        : null}
        <div className="listing-header-badge-container">
          <ListingBadge listing={listing}/>
        </div>
        <Grid fluid>
          <Row>
            <Flickity key={listing.id + '_flickity'} className={carouselClass} options={flickityOptions} >
              {sortedListingImages.map((image, index) =>
                <div key={listing.id + '_' + index} className="sliderBoxes">
                  <CloudinaryImage src={image.url} height={500} />
                </div>
              )}
            </Flickity>
          </Row>
        </Grid>
      </header>
    );
  }
}

ListingHeader.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object.isRequired
};

