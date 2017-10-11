import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import autobind from 'react-autobind';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import ListingSocial from '~/components/Listing/components/ListingSocial';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ShareListingToGroupsModal from '~/components/ShareListingToGroupsModal/ShareListingToGroupsModal';
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

    if (ShareListingToGroupsModal.listingHasSharingGroups(this.props.listing) &&
      !ShareListingToGroupsModal.listingGroupShareDismissed(this.props.listing)) {
      setTimeout(() => {
        this.showShareToGroupsModal();
      }, 3000);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.listing.id !== nextProps.listing.id) {
      this.loadListingStats(nextProps.listing);
    }
  }

  showShareToGroupsModal() {
    this.props.appProviders.modalProvider.showInfoModal({
      title: ShareListingToGroupsModal.title,
      body: <ShareListingToGroupsModal listing={this.props.listing} />
    });
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

  renderInterests(interests) {
    const { listing } = this.props;
    let shownInterests;
    let titleText;
    let groupShareElement;

    if (!interests) {
      return <LoadingSpinner />;
    } else if (interests.length === 0) {
      shownInterests = TenantRow.getEmptyTenantList();
      titleText = 'ברשימה למטה יופיעו הדיירים המעוניינים בדירה עם כל המידע עליהם';

      if (ShareListingToGroupsModal.listingHasSharingGroups(this.props.listing)) {
        groupShareElement = <div className="property-stats-share-groups">הגיעו ליותר דיירים! שתפו בקבוצות פייסבוק למחפשי דירות:<Button className="property-stats-share-groups-button" onClick={this.showShareToGroupsModal}><i className="fa fa-users" />שתף לקבוצות</Button></div>;
      }
    } else {
      shownInterests = interests;
      titleText = 'לחצו על שם הדייר על מנת לראות את כל המידע עליו';
    }

    return (
      <div className="property-stats-followers-container">
        <div className="property-stats-followers-title">
          רשימת הדיירים המתעניינים בדירה ({interests.length})
        </div>
        <div className="property-stats-value-title">
          {titleText}
        </div>
        {groupShareElement}
        <ListGroup className={interests.length === 0 ? 'property-stats-list-group-disabled' : ''}>
          {shownInterests.map(tenant => (
            <ListGroupItem key={tenant.id} disabled={tenant.disabled} className="property-stats-list-group-item">
              <TenantRow tenant={tenant.user_details || tenant} listing={listing} />
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    );
  }

  renderMatchingUsers() {
    const { listing, appProviders, appStore } = this.props;
    const { matchingUsersProvider } = appProviders;
    const { matchingUsersStore } = appStore;

    matchingUsersProvider.getMatchingUsers(listing.id);
    const matchingUsers = matchingUsersStore.get(listing.id) || [];

    if (matchingUsers.length == 0) { return null; }
    else {
      return (
        <div className="property-stats-matches-container">
          <div className="property-stats-matches-title">
            דיירים המחפשים עכשיו דירה כמו שלך:
          </div>
          <div className="property-stats-value-title">
            אלו דיירים שמחפשים דירה כמו שלכם אך טרם נחשפו למודעת הדירה. באפשרותכם ליצור איתם קשר ולעניין אותם בדירה
          </div>
          <ListGroup>
            {
              matchingUsers.map(user => (
                <ListGroupItem key={user.dorbel_user_id} className="property-stats-list-group-item">
                  <TenantRow tenant={user} listing={this.props.listing} />
                </ListGroupItem>
              ))
            }
          </ListGroup>
        </div>
      );
    }
  }

  render() {
    const { appStore, listing } = this.props;
    const listingId = listing.id;

    const listingCreatedAt = utils.formatDate(listing.created_at);
    const daysPassedSinceCratedAt = moment().diff(moment(listing.created_at), 'days');

    const tipOffset = { left: 2 };
    const interests = appStore.likeStore.likesByListingId.get(listingId);
    const hasInterests = interests && interests.length > 0;
    const views = appStore.listingStore.listingViewsById.get(listingId);
    const isRented = listing.status == 'rented';

    let step = 5;
    if (!isRented) {
      if (hasInterests) {
        step = 4;
      } else {
        step = 3;
      }
    }

    return <Grid fluid className="property-stats">
      <Row>
        <Col lg={9} md={8} sm={7}>
          {this.renderInterests(interests)}
          {(interests && interests.length > 0) ? null : this.renderMatchingUsers()}
        </Col>
        <Col lg={3} md={4} sm={5}>
          <div className="property-stats-container property-stats-share-container">
            <div>
              <span className="property-stats-share-title">
                שתפו את מודעת הדירה
              </span>
              <i className="fa fa-info-circle property-stats-share-help" aria-hidden="true"
                data-tip="למציאת דיירים - שתפו את הלינק<br />או שלחו אותו לדיירים שפנו אליכם"></i>
              <ReactTooltip type="dark" effect="solid" place="top" offset={tipOffset} multiline />
            </div>
            <div className="property-stats-share-sub-title">
              צפיות במודעה: {views || 0}
            </div>
            <ListingSocial listing={listing} />
          </div>
          <div className="property-stats-container">
            <div className="property-stats-process-title">
              תהליך ההשכרה
            </div>
            <div className="property-stats-value-title">
              תאריך פרסום: {listingCreatedAt || null}
            </div>
            <div className="property-stats-value-title">
              ימים שחלפו: {daysPassedSinceCratedAt}
            </div>
            <div className="property-stats-process-diagram">
              <div className="property-stats-process-point-half">
                יצירת מודעה
              </div>
              <div className="property-stats-process-vr-done" />
              <div className="property-stats-process-point-half">
                הוספת תמונות
              </div>
              <div className="property-stats-process-vr-done" />
              <div className={'property-stats-process-point-' + (step === 3 ? 'full' : 'half')}>
                צפיות במודעה
              </div>
              <div className={'property-stats-process-vr-' + (step > 3 ? 'done' : 'not-done')} />
              <div className={'property-stats-process-point-' + (step === 4 ? 'full' : (step === 5 ? 'half' : 'empty'))}>
                דיירים מתעניינים
              </div>
              <div className={'property-stats-process-vr-' + (step > 4 ? 'done' : 'not-done')} />
              <div className={'property-stats-process-point-' + (step === 5 ? 'full' : 'empty')}>
                הדירה הושכרה
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Grid>;
  }
}

PropertyStats.wrappedComponent.propTypes = {
  listing: PropTypes.object.isRequired,
  appStore: PropTypes.object,
  appProviders: PropTypes.object.isRequired,
};

export default PropertyStats;
