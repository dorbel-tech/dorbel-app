'use strict';
import React from 'react';
import ListingBadge from '../ListingBadge/ListingBadge';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import utils from '../../providers/utils';
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
export default class ImageCarousel extends React.Component {
  render() {
    const { listing, appStore } = this.props;
    const sortedListingImages = utils.sortListingImages(listing);

    return (
      <header className="apt-header">
        <ListingPageViews listing={listing} />
        <div className="apt-header-badge-container">
          { appStore.listingStore.isListingPublisher(listing) ? <ListingBadge listing={listing}/> : null }
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

ImageCarousel.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object.isRequired
};

