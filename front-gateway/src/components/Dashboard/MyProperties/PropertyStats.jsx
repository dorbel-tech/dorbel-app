import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row, Checkbox, ListGroup, ListGroupItem } from 'react-bootstrap';
import autobind from 'react-autobind';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import ListingSocial from '~/components/Listing/components/ListingSocial';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ShareListingToGroupsModal from '~/components/ShareListingToGroupsModal/ShareListingToGroupsModal';
import NavLink from '~/components/NavLink';
import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import utils from '~/providers/utils';
import { getDashMyPropsPath } from '~/routesHelper';

import './PropertyStats.scss';

@inject('appStore', 'appProviders') @observer
class PropertyStats extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    this.loadListingStats();
    this.showShareToGroupsModal();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.listing.id !== nextProps.listing.id) {
      this.loadListingStats(nextProps.listing);
    }
  }

  showShareToGroupsModal() {
    if (ShareListingToGroupsModal.shouldShow(this.props.listing)) {
      this.props.appProviders.modalProvider.showInfoModal({
        title: ShareListingToGroupsModal.title,
        body: <ShareListingToGroupsModal listing={this.props.listing} />,
      });
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

  renderInterests(interests, views) {
    const { listing } = this.props;
    let shownInterests;

    if (!interests) {
      return <LoadingSpinner />;
    } else if (interests.length === 0) {
      shownInterests = TenantRow.getEmptyTenantList();
    } else {
      shownInterests = interests;
    }

    return (
      <div className="property-stats-followers-container">
        <div className="property-stats-followers-title">
          רשימת הדיירים המתעניינים בדירה ({interests.length})
        </div>
        <div className="property-stats-value-title">
          {interests.length === 0 ?
            'ברשימה למטה יופיעו הדיירים המעוניינים בדירה עם כל המידע עליהם'
          :
            'לחצו על שם הדייר על מנת לראות את כל המידע עליו'
          }
        </div>
        <ListGroup className={interests.length === 0 ? 'property-stats-list-group-disabled' : ''}>
          { shownInterests.map(tenant => (
            <ListGroupItem key={tenant.id} disabled={tenant.disabled} className="property-stats-list-group-item">
              <TenantRow tenant={tenant.user_details || tenant} listing={listing} />
            </ListGroupItem>
          )) }
        </ListGroup>
      </div>
    );
  }

  render() {
    const { appStore, listing } = this.props;
    const listingId = listing.id;

    const listingCreatedAt = utils.formatDate(listing.created_at);
    const daysPassedSinceCratedAt = moment().diff(moment(listing.created_at), 'days');

    const tipOffset = {left: 2};
    const interests = appStore.likeStore.likesByListingId.get(listingId);
    const hasInterests = interests && interests.length > 0;
    const views = appStore.listingStore.listingViewsById.get(listingId);
    const isRented = listing.status == 'rented';

    return <Grid fluid className="property-stats">
            <Row>
              <Col lg={9} md={8} sm={7}>
                {this.renderInterests(interests, views)}
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
                    צפיות במודעה: {views}
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
                    <div className="property-stats-process-vr" />
                    <div className="property-stats-process-point-half">
                      הוספת תמונות
                    </div>
                    <div className="property-stats-process-vr" />
                    <div className={'property-stats-process-point-' + (hasInterests ? 'half' : 'full')}>
                      צפיות במודעה
                    </div>
                    <div className="property-stats-process-vr" />
                    <div className={'property-stats-process-point-' + (isRented ? 'half' : (hasInterests ? 'full' : 'empty'))}>
                      דיירים מתעניינים
                    </div>
                    <div className="property-stats-process-vr" />
                    <div className={'property-stats-process-point-' + (isRented ? 'full' : 'empty')}>
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
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object.isRequired,
};

export default PropertyStats;
