import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Listing from '../ListingThumbnail/ListingThumbnail.jsx';

@observer(['appProviders'])
class RelatedListings extends Component {

  constructor(props) {
    super(props);
    this.state = { relatedListings: [] };
  }

  componentDidMount() {
    const listingId = this.props.listingId;
    this.props.appProviders.apartmentsProvider.getRelatedListings(listingId)
      .then(relatedListings => {
        if (relatedListings) {
          this.setState({
            relatedListings: relatedListings
          });
        }
      });
  }

  render() {
    const relatedListings = this.state.relatedListings;

    if (relatedListings.length > 0) {
      return (
        <div className="container-fluid apt-thumb-container">
          <div className="container">
            <h5>נכסים דומים</h5>
            <div className="row">
              {
                this.state.relatedListings.map((listing) => <Listing listing={listing} key={listing.id} />)
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
  listingId: React.PropTypes.number.isRequired,
  appProviders: React.PropTypes.object.isRequired
};


export default RelatedListings;
