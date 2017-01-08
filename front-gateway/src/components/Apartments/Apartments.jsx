import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import NavLink from '~/components/NavLink';
import './Apartments.scss';

@observer(['appStore', 'appProviders'])
class Apartments extends Component {
  componentDidMount() {
    this.props.appProviders.apartmentsProvider.loadApartments();
  }

  render() {
    const { listingStore } = this.props.appStore;

    return (
    <Grid fluid>
      <Row>
        <div>
          <Col lg={7} md={6} className="search-widget-wrapper">
            <Row className="search-widget-container">
              <div className="btn-group city-picker">
                  <i data-toggle="modal" data-target="#modal-city-promise">i</i>
                  <button type="button" className="btn btn-default input-addon-right">
                      <h4 className="active-city"><span>עיר:</span> תל אביב</h4></button>
                  <button type="button" className="btn btn-default dropdown-toggle input-addon-left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled>
                      <span className="caret"></span>
                      <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul className="dropdown-menu">
                      <li><a href="#">ירושלים</a></li>
                      <li><a href="#">באר שבע</a></li>
                      <li><a href="#">שעריים</a></li>
                  </ul>
              </div>
              <Col xs={10} xsOffset={1} className="cost-slider">
                <h5 className="text-center">בחר טווח מחירים</h5>
                <div id="costRange"></div>
              </Col>
              <Col xs={10} xsOffset={1} className="roomsnum-slider">
                <h5 className="text-center">בחר מספר חדרים</h5>
                <div id="roomsRange"></div>
              </Col>
              <Col xs={10} xsOffset={1} className="size-slider">
                <h5 className="text-center">בחר גודל נכס (מ״ר)</h5>
                <div id="sizeRange"></div>
              </Col>
            </Row>
            <Row className="search-switches-container text-center">
              <Col xs={6}>
                <label>דירות ריקות &nbsp</label>
                <input type="checkbox" name="entire-apt-switch" checked/>
              </Col>
              <Col xs={6}>
                <label> דירות שותפים &nbsp</label>
                <input type="checkbox" name="roomates-apt-switch" checked/>
              </Col>
            </Row>
            <Row className="search-amenities-container">
              <Col xs={10} xsOffset={1}>
                <h5 className="text-center"><b>צמצמו את החיפוש:</b></h5>
                <Col xs={4}>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value=""/>חניה
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value=""/> מזגן
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value=""/> מרפסת
                    </label>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value=""/>מרוהטת
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value=""/> מזגן
                    </label>
                  </div>
                  <div className="checkbox disabled">
                    <label>
                      <input type="checkbox" value="" disabled/> ממ״ד
                    </label>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value=""/>גינה
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value=""/> מחסן
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value=""/> בע״ח
                    </label>
                  </div>
                </Col>
              </Col>
            </Row>
            <div className="search-results-wrapper">
              <Row className="search-results-container-list">
                {listingStore.apartments.map(listing => {
                  var apt = listing.apartment;
                  var building = apt.building;
                  var image_url = listing.images.length > 0 ? listing.images[0].url : '';

                  return  <Col key={listing.id} lg={4} sm={6} xs={12} className="clearfix">
                            <a href="/apartments/{listing.id}" className="thumbnail search-result-container-single pull-right">
                              <div className="triangle">
                                <svg viewBox="-28 30 70 70">
                                  <path className="st0" d="M-28 30l70 70V30h-70z" fill="#F09B0A"/>
                                </svg>
                                <span><i>&nbsp&nbsp</i>ריקה</span>
                              </div>
                              <div className="result-apt-image">
                                <img src={image_url} alt="..."/>
                              </div>
                              <div className="search-result-apt-bottom-strip">
                                <ul>
                                  <li>{listing.monthly_rent} ₪</li>
                                  <span>|</span>
                                  <li>{apt.size} מ״ר</li>
                                  <span>|</span>
                                  <li>{apt.rooms} חד׳</li>
                                </ul>
                              </div>
                              <div className="caption">
                                <h4>{listing.description}</h4>
                                <span>{building.street_name} {building.house_number} - {apt.apt_number}</span>
                              </div>
                            </a>
                          </Col>
                })}

                {this.props.children}
              </Row>
            </div>
          </Col>
          <Col lg={5} lgOffset={7} md={6} mdOffset={6}>
            <div id="map" className="map-search"></div>
          </Col>
        </div>
      </Row>
    </Grid>
    );
  }
}

Apartments.wrappedComponent.propTypes = {
  children: React.PropTypes.node,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Apartments;
