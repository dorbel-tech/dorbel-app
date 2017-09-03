import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row, Checkbox, ListGroup, ListGroupItem } from 'react-bootstrap';
import autobind from 'react-autobind';
import moment from 'moment';

import ListingSocial from '~/components/Listing/components/ListingSocial';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import NavLink from '~/components/NavLink';
import ReactTooltip from 'react-tooltip';
import routesHelper from '~/routesHelper';
import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import utils from '~/providers/utils';

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

  renderListedStats() {
    const { appStore, listing } = this.props;
    const listingId = listing.id;

    const listingCreatedAt = utils.formatDate(listing.created_at);
    const daysPassedSinceCratedAt = moment().diff(moment(listing.created_at), 'days');
    const listingRented = listing.status === 'rented';

    const tipOffset = {left: 2};
    const views = appStore.listingStore.listingViewsById.get(listingId);

    return <Grid fluid className="property-stats">
            <Row>
              <Col xs={3}>
                <div className="property-stats-process-title">
                תהליך ההשכרה
                </div>
                <div className="property-stats-value-title">
                תאריך פרסום: {listingCreatedAt || null}
                </div>
                <div className="property-stats-value-title">
                              ימים שחלפו: {daysPassedSinceCratedAt}
                </div>
              </Col>
              <Col xs={9}>
              </Col>
            </Row>
            <Row className="property-stats-share-container">
              <Col xs={3} className="property-stats-views">
                <div>
                  צפיות<br/>במודעה
                </div>
                <div className="property-stats-views-value">
                  {views}
                </div>
              </Col>
              <Col xs={9}>
                <div>
                  <span className="property-stats-share-title">
                    שתפו את מודעת הדירה בפייסבוק או שלחו אותה לדיירים שפונים אליכם.
                  </span>
                  <span className="property-stats-share-help" data-tip="כשאתם יוצרים מודעה בדורבל, אתם מקבלים לינק לעמוד הדירה שאותו ניתן לשתף בכל מקום- במייל, בפייסבוק או בוואצאפ.<br />
                  ניתן גם לשלוח אותו לדיירים שפנו אליכם ממודעות באתרים אחרים.<br />
                  כך תוכלו לקבל את כל המידע שחשוב לכם לדעת על הדיירים לפני שתצרו איתם קשר."><i className="fa fa-info-circle" aria-hidden="true"></i>למה לשתף?</span>
                  <ReactTooltip type="info" effect="solid" place="bottom" offset={tipOffset} multiline />
                </div>
                <ListingSocial listing={listing} />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                {this.renderLikedUsers()}
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
    const likes = appStore.likeStore.likesByListingId.get(listing.id);

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
                  <div className="property-stats-number">{likes ? likes.length : 0}</div>
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
                  <Checkbox className="property-stats-future-booking" inline checked={listing.show_for_future_booking} onChange={this.updateFutureBooking}>
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
      return <h5 className="property-stats-no-followers-title">
        כאן יופיעו הדיירים המעוניינים בדירה עם כל המידע שהם סיפרו על עצמם.
        שתפו את הלינק לדירה או שלחו אותו לדיירים שפנו אליכם בכדי שיצרו פרופיל ויאפשרו לך לדעת במי לבחור
      </h5>;
    }

    return (
      <div className="property-stats-followers-container">
        <div className="property-stats-followers-title">
          רשימת הדיירים המתעניינים בדירה ({likes.length})
        </div>
        <div className="property-stats-value-title">
          לחצו על פרופיל דייר על מנת לראות את כל המידע עליו
        </div>
        <ListGroup>
          { likes.map(like => (
              <ListGroupItem key={like.id} disabled={like.disabled} className="property-manage-list-group-item">
                <TenantRow tenant={like.user_details} listing={listing} />
              </ListGroupItem>
            )) }
        </ListGroup>
      </div>
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
