import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import utils from '~/providers/utils';
import moment from 'moment';

import './PropertyStats.scss';

@observer(['appStore', 'appProviders', 'router'])
class PropertyStats extends Component {
  constructor(props) {
    super(props);
    autobind(this);
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
    appProviders.likeProvider.getListingLikesCount(listingId);
  }

  render() {
    const { appStore, listing } = this.props;
    const listingId = listing.id;
    const views = appStore.listingStore.listingViewsById.get(listingId);        
    const registrations = this.getNumberOfOheRegistrations(listingId);
    const followers = appStore.oheStore.countFollowersByListingId.get(listingId);    
    const listingCreatedAt = utils.formatDate(listing.created_at);
    const daysPassed = moment(Date.now()).diff(moment(listing.created_at), 'days');
    const listingRented = listing.status === 'rented' || listing.status === 'unlisted';

    return  <Grid fluid className="propery-stats">
                <Row className="propery-stats-rent-title">
                  <Col xs={12}>
                    תהליך ההשכרה:
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="propery-stats-numbers-row">
                      <div className={'propery-stats-number' + (views > 0 ? ' propery-stats-number-not-empty': '')}>{views}</div>
                      <div className="propery-stats-empty"></div>
                      <div className={'propery-stats-number' + (registrations > 0 ? ' propery-stats-number-not-empty': '')}>{registrations}</div>
                      <div className="propery-stats-empty"></div>
                      <div className={'propery-stats-number propery-stats-rented-check' + (listingRented ? ' propery-stats-number-not-empty': '')}>
                        <i className="fa fa-check" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div>
                      <div className={'propery-stats-bubble' + (views > 0 ? ' propery-stats-bubble-not-empty': '')}>
                        <div className="propery-stats-bubble-text">צפיות במודעה</div>
                      </div>
                      <div className={'propery-stats-line' + (registrations > 0 ? ' propery-stats-line-not-empty': '')}></div>
                      <div className={'propery-stats-bubble' + (registrations > 0 ? ' propery-stats-bubble-not-empty': '')}>
                        <div className="propery-stats-bubble-text">הרשמות לביקורים</div>
                      </div>
                      <div className={'propery-stats-line' + (listingRented ? ' propery-stats-line-not-empty': '')}></div>
                      <div className={'propery-stats-bubble' + (listingRented ? ' propery-stats-bubble-not-empty': '')}>
                        <div className="propery-stats-bubble-text">חתימת חוזה</div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="propery-stats-publishing-title">
                  <Col xs={12}>
                    תאריך פרסום המודעה: {listingCreatedAt || null}
                  </Col>
                </Row>
                <Row className="propery-stats-listing-stats">
                  <Col xs={4}>
                    <div className="propery-stats-card">
                      <div className="propery-stats-number">{followers}</div>
                      <div className="propery-stats-title">עוקבים</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="propery-stats-card">
                      <div className="propery-stats-number">{listing.totalLikes}</div>
                      <div className="propery-stats-title">לייקים</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="propery-stats-card">
                      <div className="propery-stats-number">{daysPassed}</div>
                      <div className="propery-stats-title">ימים שחלפו</div>
                    </div>
                  </Col>
                </Row>
                <Row className="propery-stats-services-title">
                  <Col xs={12}>
                    שירותים בתשלום:
                  </Col>
                </Row>
                <Row className="propery-stats-services">
                  <Col md={4}>
                    <div className="propery-stats-service">
                      <img className="propery-stats-image" 
                          src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/dashboard/service-publishing-icon.svg"/>
                      <div className="propery-stats-title">פרסום הדירה</div>
                      <div>רוצים להשכיר מהר? הגדילו את חשיפת הדירה ע״י פרסום ממומן. הגיעו ליותר דיירים בפחות זמן</div>
                      <a className="propery-stats-button btn btn-success" 
                          href="https://www.dorbel.com/pages/services/social-advertising" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="propery-stats-service">
                      <img className="propery-stats-image" 
                          src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/dashboard/service-credit-score-icon.svg"/>
                      <div className="propery-stats-title">דו״ח נתוני אשראי</div>
                      <div>רוצים להיות בטוחים? לפני חתימה על חוזה חשוב לוודא שהדייר החדש והערבים יעמדו בתשלומים</div>
                      <a className="propery-stats-button btn btn-success" 
                          href="https://www.dorbel.com/pages/services/credit-report" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="propery-stats-service">
                      <img className="propery-stats-image" 
                          src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/dashboard/service-photography-icon.svg"/>
                      <div className="propery-stats-title">צילום והצגת הדירה</div>
                      <div>אנו נצלם ונציג עבורכם את הדירה בפני הדיירים הפוטנציאליים כדי לחסוך לכם את ההגעה לכל ביקור</div>
                      <a className="propery-stats-button btn btn-success" 
                          href="https://www.dorbel.com/pages/services/hosted-viewings" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                </Row>
              </Grid>;
  }
}

PropertyStats.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object.isRequired,
};

export default PropertyStats;
