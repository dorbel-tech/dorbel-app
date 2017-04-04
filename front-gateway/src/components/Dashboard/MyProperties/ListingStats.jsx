import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import utils from '~/providers/utils';
import moment from 'moment';

import './ListingStats.scss';

@observer(['appStore', 'appProviders', 'router'])
class ListingStats extends Component {
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
    const { appStore, appProviders } = this.props;
    const listingId = this.props.listingId;

    if (!appStore.listingStore.listingViewsById.has(listingId)) {
      appProviders.listingsProvider.loadListingPageViews(listingId);
    }

    appProviders.oheProvider.loadListingEvents(listingId);
    appProviders.oheProvider.getFollowsForListing(listingId);
    appProviders.likeProvider.getListingLikesCount(listingId);
  }

  render() {
    const { appStore, listingId } = this.props;
    const views = appStore.listingStore.listingViewsById.get(listingId);        
    const registrations = this.getNumberOfOheRegistrations(listingId);
    const followers = appStore.oheStore.countFollowersByListingId.get(listingId);
    const likes = appStore.likeStore.likesCountByListingId.get(listingId);
    const listing = appStore.listingStore.get(listingId); // Expects listingStore to be already initiated by its parent component.
    const listingCreatedAt = utils.formatDate(listing.created_at);
    const daysPassed = moment(Date.now()).diff(moment(listing.created_at), 'days');
    const listingRented = listing.status === 'rented' || listing.status === 'unlisted';

    return  <Grid fluid={true} className="dashboard-my-propery-stats">
                <Row className="rent-title">
                  <Col xs={12}>
                    תהליך ההשכרה:
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="numbers-row">
                      <div className={'number' + (views > 0 ? ' active-color': '')}>{views}</div>
                      <div className="empty"></div>
                      <div className={'number' + (registrations > 0 ? ' active-color': '')}>{registrations}</div>
                      <div className="empty"></div>
                      <div className={'number rented-check' + (listingRented ? ' active-color': '')}>
                        <i className="fa fa-check" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div>
                      <div className={'bubble' + (views > 0 ? ' active-color-border': '')}>
                        <div className="bubble-text">צפיות במודעה</div>
                      </div>
                      <div className={'line' + (registrations > 0 ? ' active-color-border-bottom': '')}></div>
                      <div className={'bubble' + (registrations > 0 ? ' active-color-border': '')}>
                        <div className="bubble-text">הרשמות לביקורים</div>
                      </div>
                      <div className={'line' + (listingRented ? ' active-color-border-bottom': '')}></div>
                      <div className={'bubble' + (listingRented ? ' active-color-border': '')}>
                        <div className="bubble-text">חתימת חוזה</div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="publishing-title">
                  <Col xs={12}>
                    תאריך פרסום המודעה: {listingCreatedAt || null}
                  </Col>
                </Row>
                <Row className="listing-stats">
                  <Col xs={4}>
                    <div className="card">
                      <div className="number">{followers}</div>
                      <div className="title">עוקבים</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="card">
                      <div className="number">{likes}</div>
                      <div className="title">לייקים</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="card">
                      <div className="number">{daysPassed}</div>
                      <div className="title">ימים שחלפו</div>
                    </div>
                  </Col>
                </Row>
                <Row className="services-title">
                  <Col xs={12}>
                    שירותים בתשלום:
                  </Col>
                </Row>
                <Row className="services">
                  <Col md={4}>
                    <div className="service">
                      <img className="image" src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/dashboard/service-publishing-icon.svg"/>
                      <div className="title">פרסום הדירה</div>
                      <div>רוצים להשכיר מהר? הגדילו את חשיפת הדירה ע״י פרסום ממומן. הגיעו ליותר דיירים בפחות זמן</div>
                      <a className="button btn btn-success" href="https://www.dorbel.com/pages/services/social-advertising" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="service">
                      <img className="image" src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/dashboard/service-credit-score-icon.svg"/>
                      <div className="title">דו״ח נתוני אשראי</div>
                      <div>רוצים להיות בטוחים? לפני חתימה על חוזה חשוב לוודא שהדייר החדש והערבים יעמדו בתשלומים</div>
                      <a className="button btn btn-success" href="https://www.dorbel.com/pages/services/credit-report" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="service">
                      <img className="image" src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/dashboard/service-photography-icon.svg"/>
                      <div className="title">צילום והצגת הדירה</div>
                      <div>אנו נצלם ונציג עבורכם את הדירה בפני הדיירים הפוטנציאליים כדי לחסוך לכם את ההגעה לכל ביקור</div>
                      <a className="button btn btn-success" href="https://www.dorbel.com/pages/services/hosted-viewings" target="_blank">לפרטים והזמנה</a>
                    </div>
                  </Col>
                </Row>
              </Grid>;
  }
}

ListingStats.wrappedComponent.propTypes = {
  listingId: React.PropTypes.number.isRequired,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object.isRequired,
};

export default ListingStats;
