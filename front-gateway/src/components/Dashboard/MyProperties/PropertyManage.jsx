import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Col, Grid, Row, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import autobind from 'react-autobind';
import moment from 'moment';
import utils from '~/providers/utils';
import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import AddTenantModal from '~/components/Tenants/AddTenantModal/AddTenantModal';
import ManageLeaseModal from './ManageLeaseModal';

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

  componentWillMount() {
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

    this.setState({showManageLeaseModal: false});
  }

  editLeaseDates() {
    this.setState({showManageLeaseModal: true});
  }

  renderTenants() {
    const tenants = this.props.appStore.listingStore.listingTenantsById.get(this.props.listing.id);

    if (!tenants) {
      return <h5>טוען...</h5>;
    } else if (tenants === 'error') {
      return <h5>חלה שגיאה בטעינת הדיירים</h5>;
    } else {
      return (
        <ListGroup>
          {
            tenants.map(tenant => (
              <ListGroupItem key={tenant.id}>
                <TenantRow tenant={tenant} />
              </ListGroupItem>
            ))
          }
        </ListGroup>
      );
    }
  }

  showAddTenantModal() {
    this.props.appProviders.modalProvider.showInfoModal({
      title: AddTenantModal.title,
      body: <AddTenantModal listing_id={this.props.listing.id} />,
    });
  }

  render() {
    const { listing } = this.props;
    const listingLeaseStart = utils.formatDate(listing.lease_start);
    const listingLeaseEnd = utils.formatDate(listing.lease_end);
    const leasePeriod = moment(listing.lease_end).diff(moment(listing.lease_start), 'days');
    const daysPassed = moment().diff(moment(listing.lease_start), 'days');
    const daysLeft = leasePeriod - daysPassed;
    const leasePeriodLabel = leasePeriod || '-';
    const daysPassedLabel = daysPassed < 0 ? 0 : daysPassed;
    const daysLeftLabel = daysLeft || '-';

    return  <Grid fluid className="property-manage">
              <Row className="property-manage-lease-title">
                <Col xs={12}>
                  מידע על השכירות:
                </Col>
              </Row>
              <Row className="property-manage-lease-period">
                <ManageLeaseModal listing={listing}
                                  show={this.state.showManageLeaseModal}
                                  onClose={this.closeManageLeaseModal}/>
                <Col xs={12}>
                  <div>
                    תקופת השכירות: {leasePeriodLabel} ימים
                  </div>
                  <div className="property-manage-lease-period-edit"
                       onClick={this.editLeaseDates}>
                    <i className="property-manage-lease-period-edit-icon fa fa-pencil-square-o"  aria-hidden="true"></i>
                    עריכה
                  </div>
                  <div className="property-manage-lease-period-start">{listingLeaseStart}</div>
                  <div className="property-manage-lease-period-start-label">תחילת שכירות</div>
                  <div className="property-manage-lease-period-days-passed">{daysPassedLabel} ימים עברו</div>
                  <ProgressBar now={daysPassed <= 0 ? (leasePeriod / 100) : daysPassed} max={leasePeriod}/>
                  <div className="property-manage-lease-period-days-left">{daysLeftLabel} ימים נותרו</div>
                  <div className="property-manage-lease-period-end">{listingLeaseEnd}</div>
                  <div className="property-manage-lease-period-end-label">תום שכירות</div>
                </Col>
              </Row>
              <Row className="property-manage-lease-title">
                <Col xs={12}>
                  דיירים נוכחים:
                  <Button onClick={this.showAddTenantModal} className="add-button pull-left">+ הוסף דייר</Button>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  {this.renderTenants()}
                </Col>
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
