'use strict';
import React from 'react';
import ListingBadge from '~/components/ListingBadge/ListingBadge';
import CloudinaryImage from '~/components/CloudinaryImage/CloudinaryImage';
import utils from '~/providers/utils';
import ListingPageViews from './ListingPageViews';
import { observer } from 'mobx-react';

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
    const { listing, appStore } = this.props;
    const sortedListingImages = utils.sortListingImages(listing);

    return (
      <header className="apt-header">
        { appStore.listingStore.isListingPublisherOrAdmin(listing) ?  <ListingPageViews listing={listing} /> : null }
        <div className="apt-header-badge-container">
          <ListingBadge listing={listing}/>
        </div>
        <div className="container-fluid">
          <div className="row">
            <Flickity key={listing.id + '_flickity'} className={carouselClass} options={flickityOptions} >
              {sortedListingImages.map((image, index) =>
                <div key={listing.id + '_' + index} className="sliderBoxes">
                  <CloudinaryImage src={image.url} height={500} />
                </div>
              )}
            </Flickity>
          </div>
        </div>
      </header>
    );
  }
}

ListingHeader.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object.isRequired
};

