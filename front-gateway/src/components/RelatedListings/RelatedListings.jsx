import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Listing from '../Listing/Listing.jsx';

@observer(['appProviders'])
class RelatedListings extends Component {

  constructor(props) {
    super(props);
    this.relatedListings = [];
  }

  componentDidMount() {
    this.relatedListings = this.appProviders.RelatedListingsProvider.get(this.props.listingId);
  }

  render() {
    return (
            <div className="container-fluid apt-thumb-container">
                <div className="container">
                    <h5>נכסים דומים</h5>
                    <div className="row">
                        {
                            this.relatedListings.each(listing => <Listing data={listing} />)
                        }
                    </div>
                </div >
            </div>
    );
  }
}

RelatedListings.wrappedComponent.propTypes = {
  listingId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
};


export default RelatedListings;
