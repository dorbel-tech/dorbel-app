import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row, Checkbox, ListGroup, ListGroupItem } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import utils from '~/providers/utils';
import { getDashMyPropsPath } from '~/routesHelper';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import autobind from 'react-autobind';
import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';

import './PropertyStats.scss';

@inject('appStore', 'appProviders') @observer
class PropertyStats extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    this.loadListingStats();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.listing.id !== nextProps.listing.id) {
      this.loadListingStats(nextProps.listing);
    }
  }

  loadListingStats(listing) {
    const { appStore, appProviders } = this.props;
    listing = listing || this.props.listing;
    const listingId = listing.id;

    if (!appStore.listingStore.listingViewsById.has(listingId)) {
      appProviders.listingsProvider.loadListingPageViews(listingId);
    }

    if (!appStore.likeStore.likesByListingId.has(listingId)) {
      appProviders.likeProvider.getLikesForListing(listingId, true);
    }
  }

  getNumberOfOheRegistrations(listingId) {
    const openHouseEvents = this.props.appStore.oheStore.oheByListingId(listingId);
    let totalRegistrations = 0;

    if (openHouseEvents) {
      openHouseEvents
        .filter(ohe => ohe.registrations)
        .forEach(ohe => totalRegistrations += ohe.registrations.length);
    }

    return totalRegistrations;
  }

  renderListedStats() {
    const { appStore, listing } = this.props;
    const listingId = listing.id;
    const views = appStore.listingStore.listingViewsById.get(listingId);
    const registrations = this.getNumberOfOheRegistrations(listingId);
    const listingCreatedAt = utils.formatDate(listing.created_at);
    const daysPassed = moment(Date.now()).diff(moment(listing.created_at), 'days');
    const listingRented = listing.status === 'rented';
    const oheTabUrl = getDashMyPropsPath(listing, '/ohe');

    return <Grid fluid className="property-stats">
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
            <Row className="property-stats-listing-stats text-center">
              <Col xs={4}>
                <div className="property-stats-card">
                  <div className="property-stats-number">{listing.totalLikes || 0}</div>
                  <div className="property-stats-title">עוקבים</div>
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

  renderRentedStats() {
    const { appStore, listing } = this.props;
    const listingId = listing.id;
    const views = appStore.listingStore.listingViewsById.get(listingId);
    const leaseStats = utils.getListingLeaseStats(listing);
    const manageTabUrl = getDashMyPropsPath(listing, '/manage');
    const tipOffset = {top: -7, left: 2};

    return <Grid fluid className="property-stats">
            <Row className="property-stats-rent-title">
              <Col xs={12}>
                מעקב אחר הנכס:
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div>
                  <div className="property-stats-number">{views || 0}</div>
                  <div className="property-stats-empty"></div>
                  <div className="property-stats-number">{listing.totalLikes || 0}</div>
                </div>
                <div>
                  <div className="property-stats-bubble">
                    <div className="property-stats-bubble-text">צפיות במודעה</div>
                  </div>
                  <div className="property-stats-empty"></div>
                  <div className="property-stats-bubble">
                    <NavLink to={manageTabUrl}><div className="property-stats-bubble-text">לייקים</div></NavLink>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="property-stats-listing-stats text-center property-stats-padding-top">
              <Col xs={6} md={5} lg={4}>
                <div className="property-stats-card">
                  <div className="property-stats-number">{leaseStats.leaseStart}</div>
                  <div className="property-stats-title">ההשכרה האחרונה</div>
                </div>
              </Col>
              <Col xs={6} md={5} lg={4}>
                <div className="property-stats-card">
                  <div className="property-stats-number">{leaseStats.daysPassedLabel}</div>
                  <div className="property-stats-title">ימים עברו</div>
                </div>
              </Col>
            </Row>
            <Row className="property-stats-listing-stats text-right property-stats-padding-top">
              <Col xs={12} md={10} lg={8}>
                <div className="property-stats-card property-stats-card-with-padding">
                  <Checkbox inline checked={listing.show_for_future_booking} onChange={this.updateFutureBooking}>
                    אפשר לדיירים לעקוב אחר הדירה להשכרה הבאה
                  </Checkbox>
                  &nbsp;
                  <span className="property-stats-info" data-tip="אפשרו לדיירים שמחפשים דירה כמו שלכם למצוא אותה ולעקוב אחריה.
                   כאשר הדירה תתפרסם להשכרה בעתיד,
                    העוקבים שלה יקבלו עדכון ויוכלו להירשם לביקור במהירות.">
                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                    &nbsp;מה זה אומר?
                  </span>
                  <ReactTooltip type="dark" effect="solid" place="top" offset={tipOffset}
                                multiline className="property-stats-future-booking-tooltip"/>
                </div>
              </Col>
            </Row>
            <Row className="property-stats-rent-title property-stats-padding-top">
              <Col xs={12}>
                עוקבים אחר הנכס:
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                {this.renderLikedUsers()}
              </Col>
            </Row>
           </Grid>;
  }

  updateFutureBooking(event) {
    const { listing, appProviders } = this.props;
    const allowFutureBooking = event.target.checked;
    const data = { show_for_future_booking: allowFutureBooking };
    const notificationProvider = this.props.appProviders.notificationProvider;

    // A check for at least one image and if no images,
    // send notification to user and do not allow future booking.
    if (allowFutureBooking && listing.images && listing.images.length < 1) {
      const err = { response: { data: 'אין באפשרותכם לאפשר את אופציה זו עד שתוסיפו לפחות תמונה אחת לנכס.' }};
      notificationProvider.error(err);
      return;
    }

    appProviders.listingsProvider.updateListing(listing.id, data);
    notificationProvider.success('עודכן בהצלחה. ');
  }

  renderLikedUsers() {
    const { listing, appStore } = this.props;
    const likes = appStore.likeStore.likesByListingId.get(listing.id);

    if (!likes) {
      return <LoadingSpinner />;
    }

    if (likes.length === 0) {
      return <h5 className="property-stats-no-followers-title">אין עוקבים אחר הנכס</h5>;
    }

    return (
      <ListGroup>
        { likes.map(like => (
            <ListGroupItem key={like.id} disabled={like.disabled} className="property-manage-tenant-item">
              <TenantRow tenant={like.user_details} />
            </ListGroupItem>
          )) }
      </ListGroup>
    );
  }

  render() {
    const { listing } = this.props;
    const listingPendingOrListed = (listing.status === 'pending' || listing.status === 'listed');

    return listingPendingOrListed ?
        this.renderListedStats()
      :
        this.renderRentedStats();
  }
}

PropertyStats.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object.isRequired,
};

export default PropertyStats;
