import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Listing from '../Listing/Listing.jsx';

@observer(['appStore', 'appProviders'])
class RelatedListings extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.appProviders.RelatedListingsProvider.getRelatedListings(this.props.listingId);
  }

  render() {

    const { relatedListingsStore } = this.props.appStore;

    return (
      <div className="container-fluid apt-thumb-container">
        <div className="container">
          <h5>נכסים דומים</h5>
          <div className="row">
            {
              relatedListingsStore.relatedListings.map((listing) => <Listing data={listing} key={listing.id} />)
            }
          </div>
        </div >
      </div>
    );
  }
}

RelatedListings.wrappedComponent.propTypes = {
  listingId: React.PropTypes.number.isRequired,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};


export default RelatedListings;
