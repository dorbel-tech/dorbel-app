import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Listing from '../ListingThumbnail/ListingThumbnail.jsx';
import '../ListingThumbnail/ListingThumbnail.scss';

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

  componentWillReceiveProps(nextProps) {
    if (this.props.listingId != nextProps.listingId) {
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
            <h4>נכסים דומים</h4>
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
