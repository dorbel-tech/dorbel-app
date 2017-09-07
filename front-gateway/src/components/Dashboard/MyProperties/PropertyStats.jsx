import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row, Checkbox, ListGroup, ListGroupItem } from 'react-bootstrap';
import autobind from 'react-autobind';
import moment from 'moment';

import ListingSocial from '~/components/Listing/components/ListingSocial';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import NavLink from '~/components/NavLink';
import ReactTooltip from 'react-tooltip';
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

    const tipOffset = {left: 2};
    const interests = appStore.likeStore.likesByListingId.get(listingId);
    const hasInterests = interests && interests.length > 0;
    const views = appStore.listingStore.listingViewsById.get(listingId);

    return <Grid fluid className="property-stats">
            <Row>
              <Col lg={9} md={8} sm={7}>
                {this.renderLikedUsers(interests, views)}
              </Col>
              <Col lg={3} md={4} sm={5}>
                {hasInterests &&
                  <div className="property-stats-container">
                    <div>
                      <span className="property-stats-share-title">
                        שתפו את מודעת הדירה
                      </span>
                      <i className="fa fa-info-circle property-stats-share-help" aria-hidden="true"
                        data-tip="שתפו את מודעת הדירה במייל,<br />בפייסבוק או בוואצאפ או שלחו לינק<br />לדיירים שפנו אליכם בטלפון. כך<br />תקבלו את כל המידע שחשוב לדעת על<br />הדיירים לפני שתצרו איתם קשר"></i>
                      <ReactTooltip type="dark" effect="solid" place="bottom" offset={tipOffset} multiline />
                    </div>
                    <div className="property-stats-share-sub-title">
                      צפיות במודעה: {views}
                    </div>
                    <ListingSocial listing={listing} />
                  </div>
                }
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
                    <div className="property-stats-process-point-full">
                      יצירת מודעה
                    </div>
                    <div className="property-stats-process-vr" />
                    <div className="property-stats-process-point-full">
                      הוספת תמונות
                    </div>
                    <div className="property-stats-process-vr" />
                    <div className="property-stats-process-point-full">
                      צפיות במודעה
                    </div>
                    <div className="property-stats-process-vr" />
                    <div className={'property-stats-process-point-' + (hasInterests ? 'full' : 'empty')}>
                      דיירים מתעניינים
                    </div>
                    <div className="property-stats-process-vr" />
                    <div className="property-stats-process-point-empty">
                      הדירה הושכרה
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>;
  }

  renderLikedUsers(interests, views) {
    const { listing } = this.props;

    if (!interests) {
      return <LoadingSpinner />;
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
        {interests.length === 0 &&
          <div className="property-stats-container">
            <div className="property-stats-share-title">
              לקבלת דיירים מתעניינים-  שתפו את הלינק או שלחו אותו לדיירים שפנו אליכם
            </div>
            <ListingSocial listing={listing} />
            <div className="property-stats-views">
              <div>
                צפיות<br/>במודעה
              </div>
              <div className="property-stats-views-value">
                {views || 0}
              </div>
            </div>
          </div>
        }
        <ListGroup>
          { interests.map(like => (
            <ListGroupItem key={like.id} disabled={like.disabled} className="property-manage-list-group-item">
              <TenantRow tenant={like.user_details} listing={listing} />
            </ListGroupItem>
          )) }
        </ListGroup>
      </div>
    );
  }

  render() {
    return this.renderListedStats();
  }
}

PropertyStats.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object.isRequired,
};

export default PropertyStats;
