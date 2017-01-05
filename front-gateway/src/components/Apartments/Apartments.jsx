import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NavLink from '~/components/NavLink';

@observer(['appStore', 'appProviders'])
class Apartments extends Component {
  componentDidMount() {
    this.props.appProviders.apartmentsProvider.loadApartments();
  }

  render() {
    const { listingStore } = this.props.appStore;

    return (
      <div>
        {listingStore.apartments.map(listing => {
          var apt = listing.apartment;
          var building = apt.building;
          var image_url = listing.images.length > 0 ? listing.images[0].url : '';

          return  <div key={listing.id} class="col-lg-4 col-md-6 col-sm-6 col-xs-12 clearfix">
                    <a href="/apartments/{listing.id}" class="thumbnail search-result-container-single pull-right">
                      <div class="triangle">
                        <svg>

                        </svg>
                        <span><i>&nbsp&nbsp</i>ריקה</span>
                      </div>
                      <div class="result-apt-image">
                        <img src={image_url} alt="..."/>
                      </div>
                      <div class="search-result-apt-bottom-strip">
                        <ul>
                          <li>{listing.monthly_rent} ₪</li>
                          <span>|</span>
                          <li>{apt.size} מ״ר</li>
                          <span>|</span>
                          <li>{apt.rooms} חד׳</li>
                        </ul>
                      </div>
                      <div class="caption">
                        <h4>{listing.description}</h4>
                        <span>{building.street_name} {building.house_number} - {apt.apt_number}</span>
                      </div>
                    </a>
                  </div>
        })}

        {this.props.children}
      </div>
    );
  }
}

Apartments.wrappedComponent.propTypes = {
  children: React.PropTypes.node,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Apartments;
