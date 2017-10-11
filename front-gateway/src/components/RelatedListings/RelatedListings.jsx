import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail.jsx';
import '../ListingThumbnail/ListingThumbnail.scss';

@inject('appProviders') @observer
class RelatedListings extends Component {

  constructor(props) {
    super(props);
    this.state = { relatedListings: [] };
  }

  componentDidMount() {
    const apartmentId = this.props.apartmentId;
    this.props.appProviders.searchProvider.getRelatedListings(apartmentId)
      .then(relatedListings => {
        if (relatedListings) {
          this.setState({
            relatedListings: relatedListings
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.apartmentId != nextProps.apartmentId) {
      this.props = nextProps;
      this.componentDidMount();
    }
  }

  render() {
    const relatedListings = this.state.relatedListings;

    if (relatedListings.length > 0) {
      return (
        <div className="container-fluid apt-thumb-container">
          <div className="container">
            <h4 className="related-listings-title">נכסים דומים</h4>
            <div className="row">
              {
                this.state.relatedListings.map((listing) => <ListingThumbnail listing={listing} key={listing.id} />)
              }
            </div>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

RelatedListings.wrappedComponent.propTypes = {
  apartmentId: PropTypes.number.isRequired,
  appProviders: PropTypes.object.isRequired
};


export default RelatedListings;
