import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import utils from '~/providers/utils';
import { getDashMyPropsPath } from '~/routesHelper';
import moment from 'moment';

import './PropertyStats.scss';

@inject('appStore', 'appProviders', 'router') @observer
class PropertyStats extends Component {
  constructor(props) {
    super(props);
  }

  getNumberOfOheRegistrations(listingId) {
    const openHouseEvents = this.props.appStore.oheStore.oheByListingId(listingId);
    let totalRegistrations = 0;
    
    openHouseEvents.map(ohe => {
      if (ohe.registrations) {
        totalRegistrations += ohe.registrations.length;
      }
    });

    return totalRegistrations;
  }

  componentDidMount() {
    const { appStore, appProviders, listing } = this.props;
    const listingId = listing.id;

    if (!appStore.listingStore.listingViewsById.has(listingId)) {
      appProviders.listingsProvider.loadListingPageViews(listingId);
    }

    appProviders.oheProvider.loadListingEvents(listingId);
    appProviders.oheProvider.getFollowsForListing(listingId);
  }

  render() {
    const { appStore, listing } = this.props;
    const listingId = listing.id;
    const views = appStore.listingStore.listingViewsById.get(listingId);        
    const registrations = this.getNumberOfOheRegistrations(listingId);
    const listingCreatedAt = utils.formatDate(listing.created_at);
    const daysPassed = moment(Date.now()).diff(moment(listing.created_at), 'days');
    const listingRented = listing.status === 'rented';
    const oheTabUrl = getDashMyPropsPath(listing, '/ohe');

    return  <Grid fluid className="property-stats">
                <Row className="property-stats-rent-title">
                  <Col xs={12}>
                    תהליך ההשכרה:
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div>
                      <div className={'property-stats-number' + (views > 0 ? ' property-stats-number-not-empty': '')}>{views || 0}</div>
                      <div className="property-stats-empty"></div>
                      <div className={'property-stats-number' + (registrations > 0 ? ' property-stats-number-not-empty': '')}>
                        <NavLink to={oheTabUrl}>{registrations || 0}</NavLink></div>
                      <div className="property-stats-empty"></div>
                      <div className={'property-stats-number property-stats-rented-check' + (listingRented ? ' property-stats-number-not-empty': '')}>
                        <i className="fa fa-check" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div>
                      <div className={'property-stats-bubble' + (views > 0 ? ' property-stats-bubble-not-empty': '')}>
                        <div className="property-stats-bubble-text">צפיות במודעה</div>
                      </div>
                      <div className={'property-stats-line' + (registrations > 0 ? ' property-stats-line-not-empty': '')}></div>
                      <div className={'property-stats-bubble' + (registrations > 0 ? ' property-stats-bubble-not-empty': '')}>
                        <NavLink to={oheTabUrl}><div className="property-stats-bubble-text">הרשמות לביקורים</div></NavLink>
                      </div>
                      <div className={'property-stats-line' + (listingRented ? ' property-stats-line-not-empty': '')}></div>
                      <div className={'property-stats-bubble' + (listingRented ? ' property-stats-bubble-not-empty': '')}>
                        <div className="property-stats-bubble-text">הושכרה</div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="property-stats-publishing-title">
                  <Col xs={12}>
                    תאריך פרסום המודעה: {listingCreatedAt || null}
                  </Col>
                </Row>
                <Row className="property-stats-listing-stats">
                  <Col xs={4}>
                    <div className="property-stats-card">
                      <div className="property-stats-number">{this.props.followers}</div>
                      <div className="property-stats-title">עוקבים</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="property-stats-card">
                      <div className="property-stats-number">{listing.totalLikes || 0}</div>
                      <div className="property-stats-title">לייקים</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="property-stats-card">
                      <div className="property-stats-number">{daysPassed || 0}</div>
                      <div className="property-stats-title">ימים שחלפו</div>
                    </div>
                  </Col>
                </Row>
                <Row className="property-stats-services-title">
                  <Col xs={12}>
                    שירותים בתשלום:
                  </Col>
                </Row>
                <Row className="property-stats-services">
                  <Col md={4}>
                    <div className="property-stats-service">
                      <img className="property-stats-image"
                          src="https://static.dorbel.com/images/dashboard/service-publishing-icon.svg"/>
                      <div className="property-stats-title">פרסום פרימיום</div>
                      <div>הגדילו את חשיפת הדירה ע״י פרסום ממומן. הגיעו ליותר דיירים בפחות זמן</div>
                      <a className="property-stats-button btn btn-success"
                          href="https://www.dorbel.com/pages/services/social-advertising?utm_source=app&utm_medium=link&utm_campaign=my-properties" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="property-stats-service">
                      <img className="property-stats-image"
                          src="https://static.dorbel.com/images/dashboard/service-credit-score-icon.svg"/>
                      <div className="property-stats-title">דו״ח נתוני אשראי</div>
                      <div>הכירו את הדיירים הבאים שלכם חסכו הרבה כסף וצרות בעזרת בדיקה אחת פשוטה ומהירה</div>
                      <a className="property-stats-button btn btn-success"
                          href="https://www.dorbel.com/pages/services/credit-report?utm_source=app&utm_medium=link&utm_campaign=my-properties" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="property-stats-service">
                      <img className="property-stats-image"
                          src="https://static.dorbel.com/images/dashboard/service-photography-icon.svg"/>
                      <div className="property-stats-title">צילום הדירה</div>
                      <div>מודעה עם תמונות טובות נחשפת לפי 5 יותר דיירים. הזמינו את הצלם שלנו עוד היום</div>
                      <a className="property-stats-button btn btn-success"
                          href="https://www.dorbel.com/pages/services/hosted-viewings?utm_source=app&utm_medium=link&utm_campaign=my-properties" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                </Row>
              </Grid>;
  }
}

PropertyStats.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  followers: React.PropTypes.number.isRequired,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object.isRequired,
};

export default PropertyStats;
