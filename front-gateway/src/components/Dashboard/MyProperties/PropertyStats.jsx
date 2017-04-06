import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Grid, Row } from 'react-bootstrap';
import utils from '~/providers/utils';
import moment from 'moment';

import './PropertyStats.scss';

@observer(['appStore', 'appProviders', 'router'])
class PropertyStats extends Component {
  constructor(props) {
    super(props);
  }

  getNumberOfOheRegistrations(listingId) {
    const openHouseEvents = this.props.appStore.oheStore.oheByListingId(listingId);
    let totalRegistrations = 0;
    
    openHouseEvents.map(ohe => {
      totalRegistrations += ohe.registrations.length;
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
    const listingRented = listing.status === 'rented' || listing.status === 'unlisted';

    return  <Grid fluid className="property-stats">
                <Row className="property-stats-rent-title">
                  <Col xs={12}>
                    תהליך ההשכרה:
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="property-stats-numbers-row">
                      <div className={'property-stats-number' + (views > 0 ? ' property-stats-number-not-empty': '')}>{views || 0}</div>
                      <div className="property-stats-empty"></div>
                      <div className={'property-stats-number' + (registrations > 0 ? ' property-stats-number-not-empty': '')}>{registrations || 0}</div>
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
                        <div className="property-stats-bubble-text">הרשמות לביקורים</div>
                      </div>
                      <div className={'property-stats-line' + (listingRented ? ' property-stats-line-not-empty': '')}></div>
                      <div className={'property-stats-bubble' + (listingRented ? ' property-stats-bubble-not-empty': '')}>
                        <div className="property-stats-bubble-text">חתימת חוזה</div>
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
                      <div className="property-stats-title">פרסום הדירה</div>
                      <div>רוצים להשכיר מהר? הגדילו את חשיפת הדירה ע״י פרסום ממומן. הגיעו ליותר דיירים בפחות זמן</div>
                      <a className="property-stats-button btn btn-success"
                          href="https://www.dorbel.com/pages/services/social-advertising" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="property-stats-service">
                      <img className="property-stats-image"
                          src="https://static.dorbel.com/images/dashboard/service-credit-score-icon.svg"/>
                      <div className="property-stats-title">דו״ח נתוני אשראי</div>
                      <div>רוצים להיות בטוחים? לפני חתימה על חוזה חשוב לוודא שהדייר החדש והערבים יעמדו בתשלומים</div>
                      <a className="property-stats-button btn btn-success"
                          href="https://www.dorbel.com/pages/services/credit-report" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="property-stats-service">
                      <img className="property-stats-image"
                          src="https://static.dorbel.com/images/dashboard/service-photography-icon.svg"/>
                      <div className="property-stats-title">צילום והצגת הדירה</div>
                      <div>אנו נצלם ונציג עבורכם את הדירה בפני הדיירים הפוטנציאליים כדי לחסוך לכם את ההגעה לכל ביקור</div>
                      <a className="property-stats-button btn btn-success"
                          href="https://www.dorbel.com/pages/services/hosted-viewings" target="_blank">לפרטים והזמנה</a>
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
