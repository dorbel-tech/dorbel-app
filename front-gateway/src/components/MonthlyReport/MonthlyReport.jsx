import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import moment from 'moment';

import { Grid, Row, Col, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ListingInfo from '~/components/Listing/components/ListingInfo';
import TenantRow from '~/components/Tenants/TenantRow/TenantRow';

import ReportSection from './ReportSection/ReportSection';
import LeaseStats from './LeaseStats/LeaseStats';

import './MonthlyReport.scss';

const STATIC_ASSETS_URL = 'https://static.dorbel.com/images/icons/monthly-report/';

@inject('appStore', 'appProviders') @observer
class MonthlyReport extends Component {
  static viewportWidth = 500;
  static hideFooter = true;
  static hideHeader = true;

  constructor(props) {
    super(props);
    autobind(this);

    this.authProvider = props.appProviders.authProvider;
    this.listingsProvider = props.appProviders.listingsProvider;
    this.navProvider = props.appProviders.navProvider;
    this.listingStore = props.appStore.listingStore;
    this.authStore = props.appStore.authStore;

    this.loadingSpinner = (
      <div className="loader-container">
        <LoadingSpinner />
      </div>
    );

    this.state = {
      isLoading: true,
      isTenantsLoading: true
    };
  }

  loadFullListingDetails(listingId) {
    if (!this.listingStore.get(listingId)) {
      this.setState({ isLoading: true });
      this.listingsProvider.loadFullListingDetails(listingId)
        .then(() => { this.setState({ isLoading: false }); });
    }
    else {
      this.setState({ isLoading: false, });
    }
  }

  loadTenantDetails(listingId) {
    if (!this.listingStore.listingTenantsById.get(listingId)) {
      this.setState({ isTenantsLoading: true });
      this.listingsProvider.loadListingTenants(listingId)
        .then(() => { this.setState({ isTenantsLoading: false }); });
    }
    else {
      this.setState({ isTenantsLoading: false, });
    }
  }

  componentDidMount() {
    if (!this.authProvider.shouldLogin()) {
      const listingId = this.props.listingId;
      this.loadFullListingDetails(listingId);
      this.loadTenantDetails(listingId);
    }
  }

  renderHeader(month, year) {
    const monthName = moment().locale('he').month(month - 1).format('MMMM');
    let shortMonthName = monthName.length <= 4 ? monthName : monthName.substring(0, 3) + '\'';

    return (
      <Row className="monthly-report-heading">
        <Col xs={9} className="monthly-report-heading-text">
          <div>{`היי, ${this.authStore.profile.first_name || ''}`}</div>
          <div>הנה מה שחשוב לדעת על הדירה שלך בחודש האחרון:</div>
        </Col>
        <Col xs={3} className="monthly-report-heading-stamp">
          <img className="logo" src="https://static.dorbel.com/images/logo/dorbel_logo_purple.svg" />
          <div className="date-container">{`${shortMonthName} ${year}`}</div>
        </Col>
      </Row>
    );
  }

  renderFooter() {
    return (
      <Row className="monthly-report-footer">
        <Col xs={9}>
          <div className="monthly-report-footer-copyrights">
            © כל הזכויות שמורות לדורבל טכנולוגיות בע״מ 2017.
            <br />
            Copyright © 2017 dorbel technologies ltd, All rights reserved.
          </div>
        </Col>
        <Col xs={3} className="monthly-report-footer-visit-us">
          (: visit us

          <div className="links">
            <a href="http://www.dorbel.com" onClick={this.navProvider.handleHrefClick} >
              <i className="fa fa-home" />
            </a>
            <a href="https://www.facebook.com/dorbel.home/" onClick={this.navProvider.handleHrefClick}>
              <i className="fa fa-facebook" />
            </a>
            <a href="https://www.linkedin.com/company/dorbel" onClick={this.navProvider.handleHrefClick}>
              <i className="fa fa-linkedin" />
            </a>
          </div>
        </Col>
      </Row >
    );
  }

  renderStatsSection(listing, month, year) {
    return (
      <ReportSection
        title="פרטי הנכס"
        iconSrc={STATIC_ASSETS_URL + 'property-details.svg'}
        body={
          <LeaseStats
            listing={listing}
            month={month}
            year={year}
          />}
      />
    );
  }

  renderFutureBookingSection(listing) {
    return listing.show_for_future_booking ?
      undefined
      :
      (
        <Row className="monthly-report-future-booking">
          <Col xs={2}>
            <a
              className="monthly-report-future-booking-icon"
              onClick={this.navProvider.handleHrefClick}
              href={`/dashboard/my-properties/${listing.id}/stats`}>
              <img src={STATIC_ASSETS_URL + 'future-booking.svg'} />
            </a>
          </Col>
          <Col xs={10}>
            <div className="monthly-report-future-booking-text">
              דירתך
              <span className="darker">&nbsp;אינה&nbsp;</span>
              נמצאת במאגר הדירות להשכרה עתידית של דורבל.
              באמצעות שינוי בהגדרות תוכלו לאפשר לדיירים למצוא ולעקוב אחר הנכס שלכם כשהוא מושכר
              במטרה לקבל עדכון כאשר הוא מתפנה למען תהליך השכרה מהיר ונוח יותר בעתיד.
              &nbsp;
              <a href={`/dashboard/my-properties/${listing.id}/stats`}
                onClick={this.navProvider.handleHrefClick}>
                הכנס לשינוי הגדרות
              </a>
            </div>
          </Col>
        </Row>
      );
  }

  renderPropertyDetailsSection(listing) {
    return (
      <ReportSection
        title="פרטי הנכס"
        iconSrc={STATIC_ASSETS_URL + 'property-details.svg'}
        body={
          <Col>
            <Row className="property-details-section">
              <Col xs={12} className="property-details-section-header">
                <div
                  style={{ backgroundImage: `url('${listing.images[0] ? listing.images[0].url : undefined}')` }}
                  className="property-details-section-header-image" />
                <span className="property-details-section-header-text">
                  <i className="fa fa-map-pin" />&nbsp;
                      {`${listing.apartment.building.street_name} ${listing.apartment.building.house_number}, דירה ${listing.apartment.apt_number}`}
                </span>
              </Col>
            </Row>
            <ListingInfo className="property-details-section-listing-info" mode="report" listing={listing} />
          </Col>
        }
      />
    );
  }

  renderTenantsSection(listing) {
    let body;
    if (this.state.isTenantsLoading) {
      body = this.loadingSpinner;
    }
    else {
      let tenants = this.props.appStore.listingStore.listingTenantsById.get(listing.id);
      const hasTenants = (tenants.length > 0);
      tenants = hasTenants ? tenants : TenantRow.getEmptyTenantList();
      body =
        (<div className="current-tenants-section">
          <ListGroup>
            {
              tenants.map(tenant => (
                <ListGroupItem key={tenant.id} disabled={tenant.disabled}>
                  <TenantRow tenant={tenant} mode="static" />
                </ListGroupItem>
              ))
            }
          </ListGroup>
          {hasTenants ?
            undefined
            :
            <div>
              <Button className="current-tenants-section-add-button"
                href={`/dashboard/my-properties/${listing.id}/manage`}
                onClick={this.navProvider.handleHrefClick}>
                + להוספת דיירים
              </Button>
            </div>}
        </div>);
    }

    return (
      <ReportSection
        title="דיירים נוכחיים"
        iconSrc={STATIC_ASSETS_URL + 'current-tenants.svg'}
        body={body} />
    );
  }

  renderGoToDashboardSection(listing) {
    return (
      <ReportSection
        iconSrc={STATIC_ASSETS_URL + 'your-account.svg'}
        body={
          <div className="go-to-dashboard-section">
            <span>
              היכנסו לחשבונכם באתר dorbel לצפייה בנתונים נוספים בנוגע לנכס שלכם ולאפשרויות נוספות לניהול חכם יותר שלו.
            </span>
            <div>
              <Button
                href={`/dashboard/my-properties/${listing.id}`}
                onClick={this.navProvider.handleHrefClick}
                className="go-to-dashboard-section-button">
                <i className="fa fa-home" />&nbsp;
                לניהול הנכס
              </Button>
            </div>
          </div>
        } />
    );
  }

  render() {
    if (this.state.isLoading) {
      return this.loadingSpinner;
    }
    else {
      const { listingId, month, year } = this.props;
      const listing = this.props.appStore.listingStore.get(listingId);

      return (
        <Grid fluid className="monthly-report-main-grid">
          {this.renderHeader(month, year)}
          {this.renderPropertyDetailsSection(listing)}
          {this.renderStatsSection(listing, month, year)}
          {this.renderFutureBookingSection(listing)}
          {this.renderTenantsSection(listing)}
          {this.renderGoToDashboardSection(listing)}
          {this.renderFooter()}
        </Grid >
      );
    }
  }
}

MonthlyReport.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  listingId: React.PropTypes.string.isRequired,
  month: React.PropTypes.string.isRequired,
  year: React.PropTypes.string.isRequired
};


export default MonthlyReport;
