import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Col, Grid, Row, ListGroup, ListGroupItem, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import autobind from 'react-autobind';
import utils from '~/providers/utils';
import moment from 'moment';

import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import AddTenantModal from '~/components/Tenants/AddTenantModal/AddTenantModal';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ManageLeaseModal from './ManageLeaseModal';

import MonthlyRentBox from '~/components/MonthlyReport/LeaseStats/SummaryBox/Instances/MonthlyRentBox';
import RentPayedBox from '~/components/MonthlyReport/LeaseStats/SummaryBox/Instances/RentPayedBox';
import PropertyValueBox from '~/components/MonthlyReport/LeaseStats/SummaryBox/Instances/PropertyValueBox';
import TotalIncomeBox from '~/components/MonthlyReport/LeaseStats/SummaryBox/Instances/TotalIncomeBox';
import TotalYieldBox from '~/components/MonthlyReport/LeaseStats/SummaryBox/Instances/TotalYieldBox';
import LeaseStatsVM from '~/components/MonthlyReport/LeaseStats/LeaseStatsVM.js';

import './PropertyManage.scss';

@inject('appProviders', 'appStore') @observer
class PropertyManage extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      showManageLeaseModal: false
    };
  }

  componentDidMount() {
    this.props.appProviders.listingsProvider.loadListingTenants(this.props.listing.id);
  }

  closeManageLeaseModal(confirm, newLeaseStart, newLeaseEnd) {
    const { appProviders, listing } = this.props;

    if (confirm) {
      appProviders.listingsProvider.updateListing(listing.id,
        {
          lease_start: newLeaseStart,
          lease_end: newLeaseEnd
        });
    }

    this.setState({ showManageLeaseModal: false });
  }

  editLeaseDates() {
    this.setState({ showManageLeaseModal: true });
  }

  renderLeaseStats(listing) {
    if (listing.status == 'rented') {
      const now = moment();
      const month = now.month() + 1; // +1 because months are 0 based
      const year = now.year();
      const statsVM = new LeaseStatsVM(listing, month, year);
      const { handleHrefClick } = this.props.appProviders.navProvider;
      return (
        <Row className="property-manage-lease-stats">
          <Col>
            <Row>
              <Col>
                <DropdownButton title='הצג דו"ח חודשי' className="report-date-selector">
                  {
                    statsVM.monthList.map((item) => {
                      return (
                        <MenuItem
                          href={`/monthly-report/${listing.id}/${item.year}/${item.month}`}
                          target="_blank"
                          onClick={handleHrefClick}>
                          {`${item.month < 10 ? '0' + item.month : item.month}/${item.year}`}
                        </MenuItem>
                      );
                    })
                  }
                </DropdownButton>
              </Col>
            </Row>
            <Row>
              <Col lg={5} md={12} className="property-manage-lease-stats-group">
                <Row className="property-manage-lease-stats-group-heading">
                  <Col>
                    הכנסות:
                  </Col>
                </Row>
                <Row className="property-manage-lease-stats-group-data">
                  <Col xs={6}>
                    <MonthlyRentBox leaseStatsVM={statsVM} />
                  </Col>
                  <Col xs={6}>
                    <RentPayedBox leaseStatsVM={statsVM} />
                  </Col>
                </Row>
              </Col>
              <Col lg={1} mdHidden />
              <Col lg={6} md={12} className="property-manage-lease-stats-group">
                <Row className="property-manage-lease-stats-group-heading">
                  <Col>
                    תשואה:
                  </Col>
                </Row>
                <Row className="property-manage-lease-stats-group-data">
                  <Col xs={4}>
                    <PropertyValueBox leaseStatsVM={statsVM} />
                  </Col>
                  <Col xs={4}>
                    <TotalIncomeBox leaseStatsVM={statsVM} />
                  </Col>
                  <Col xs={4}>
                    <TotalYieldBox leaseStatsVM={statsVM} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }
  }

  renderTenants() {
    const listingTitle = utils.getListingTitle(this.props.listing);
    let tenants = this.props.appStore.listingStore.listingTenantsById.get(this.props.listing.id);

    if (!tenants) {
      return <LoadingSpinner />;
    } else if (tenants === 'error') {
      return <h5>חלה שגיאה בטעינת הדיירים</h5>;
    }

    if (tenants.length === 0) {
      tenants = TenantRow.getEmptyTenantList();
    }

    return (
      <ListGroup>
        {tenants.map(tenant => (
          <ListGroupItem key={tenant.id} disabled={tenant.disabled} className="property-manage-tenant-item">
            <TenantRow tenant={tenant} listingTitle={listingTitle} showActionButtons />
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }

  showAddTenantModal() {
    this.props.appProviders.modalProvider.showInfoModal({
      title: AddTenantModal.title,
      body: <AddTenantModal listing_id={this.props.listing.id} />,
    });
  }

  render() {
    const { appProviders, listing } = this.props;
    const leaseStats = utils.getListingLeaseStats(listing);
    const leasePeriodLabel = leaseStats.leasePeriod || '-';
    const isActiveListing = appProviders.listingsProvider.isActiveListing(listing);

    return <Grid fluid className="property-manage">
      <Row className="property-manage-lease-title">
        <Col xs={12}>
          מידע על השכירות:
                </Col>
      </Row>
      <Row className="property-manage-lease-period">
        <ManageLeaseModal listing={listing}
          show={this.state.showManageLeaseModal}
          onClose={this.closeManageLeaseModal} />
        <Col xs={12}>
          <div>
            תקופת השכירות: {leasePeriodLabel} ימים
                  </div>
          <div className="property-manage-lease-period-edit"
            onClick={this.editLeaseDates}>
            <i className="property-manage-lease-period-edit-icon fa fa-pencil-square-o" aria-hidden="true"></i>
            עריכה
                  </div>
          <div className="property-manage-lease-period-start">{leaseStats.leaseStart}</div>
          <div className="property-manage-lease-period-start-label">תחילת שכירות</div>
          <div className="property-manage-lease-period-days-passed">{leaseStats.daysPassedLabel} ימים עברו</div>
          <ProgressBar now={leaseStats.daysPassed <= 0 ? (leaseStats.leasePeriod / 100) : leaseStats.daysPassed} max={leaseStats.leasePeriod} />
          <div className="property-manage-lease-period-days-left">{leaseStats.daysLeft} ימים נותרו</div>
          <div className="property-manage-lease-period-end">{leaseStats.leaseEnd}</div>
          <div className="property-manage-lease-period-end-label">תום שכירות</div>
        </Col>
      </Row>
      {this.renderLeaseStats(listing)}
      <Row className="property-manage-lease-title">
        <Col xs={12}>
          {isActiveListing ? 'דיירים נוכחיים:' : 'דיירים קודמים:'}
          <Button onClick={this.showAddTenantModal} className="add-button pull-left">הוסף דייר</Button>
        </Col>
      </Row>
      <Row>
        {this.renderTenants()}
      </Row>
    </Grid>;
  }
}

PropertyManage.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object.isRequired,
  listing: React.PropTypes.object.isRequired
};

export default PropertyManage;
