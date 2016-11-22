import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer(['appStore', 'appProviders'])
class Apartment extends Component {
  componentDidMount() {
    this.props.appProviders.apartmentsProvider.loadSingleApartment(this.props.apartmentId);
  }

  renderImageGallery(apartment) {
    return ( 
      <header className="apt-header">
        <div className="container-fluid">
          <div className="row">
            <div className="apt-gallery">
              {apartment.images.map(image => (<div className="gallery-cell"><img src={image.url} /></div>))}
            </div>
          </div>
        </div>
      </header>);
  }

  render() {
    // TODO : mixup between listing and apartment here !!!
    const listing = this.props.appStore.apartmentStore.apartmentsById.get(this.props.apartmentId);

    if (!listing) {
      return (<div><h4>Loading...</h4></div>);  
    }

    const title = listing.title || `${listing.apartment.building.street_name} ${listing.apartment.building.house_number} - ${listing.apartment.apt_number}`;

    return (
      <div>
        {this.renderImageGallery(listing)}
        <div className="container-fluid apt-headline-container">
          <div className="container">
            <div className="row">
              <div className="col-md-9">
                <h2>{title}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid apt-highlights-container">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                <ul className="row">
                  <li className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href="">
                      <svg><use href="assets/svg/images.svg#dorbel_icon_location"></use></svg>
                      <div>טשרניחובסקי, תל אביב</div>
                    </a>
                  </li>
                  <li className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href="">
                      <svg><use href="assets/svg/images.svg#dorbel_icon_bed"></use></svg>
                      <div>{listing.apartment.rooms} חדרים</div>
                    </a>
                  </li>
                  <li className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href="">
                      <svg><use href="assets/svg/images.svg#dorbel_icon_ruler"></use></svg>
                      <div>{listing.apartment.size} מ״ר</div>
                    </a>
                  </li>
                  <li className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href="">
                      <svg><use href="assets/svg/images.svg#dorbel_icon_stairs"></use></svg>
                      <div>קומה 3/4 + מעלית</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Apartment.wrappedComponent.propTypes = {
  apartmentId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object
};

export default Apartment;
