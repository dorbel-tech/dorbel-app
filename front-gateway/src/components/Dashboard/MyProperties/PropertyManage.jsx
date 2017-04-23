import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Col, Grid, Row } from 'react-bootstrap';
import NavLink from '~/components/NavLink';
import utils from '~/providers/utils';
import { getDashMyPropsPath } from '~/routesHelper';
import moment from 'moment';

import './PropertyManage.scss';

@inject('appStore', 'appProviders', 'router') @observer
class PropertyManage extends Component {
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
    const listingLeaseStart = utils.formatDate(listing.lease_start);
    const listingLeaseEnd = utils.formatDate(listing.lease_end);

    let daysPassed;
    if (listing.lease_end && listing.lease_start) {
      daysPassed = moment(listing.lease_start).diff(moment(listing.lease_end), 'days');
    } else {
      daysPassed = false;
    }
    const daysPassedLabel = daysPassed || '---';

    return  <Grid fluid className="property-manage">
              <Row className="property-manage-lease-title">
                <Col xs={12}>
                  מידע על השכירות:
                </Col>
              </Row>
              <Row className="property-manage-lease-period">
                <Col xs={12}>
                  <div>
                    משך תקופת שכירות נוכחית: {daysPassedLabel} ימים
                  </div>
                  <div>
                    + הוספת מועדי תחילת ותום שכירות
                  </div>
                  <div>
                    <span>{listingLeaseStart}</span>
                    <ProgressBar now={0}/>
                    <span>{listingLeaseEnd}</span>
                  </div>
                  <div>
                    תחילת שכירות
                    {daysPassedLabel} ימים נותרו
                    תום שכירות
                  </div>
                </Col>
              </Row>
            </Grid>;
  }
}

PropertyManage.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object.isRequired,
};

export default PropertyManage;
