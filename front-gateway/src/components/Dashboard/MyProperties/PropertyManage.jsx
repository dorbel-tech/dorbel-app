import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Col, Grid, Row, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import autobind from 'react-autobind';
import utils from '~/providers/utils';
import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import AddTenantModal from '~/components/Tenants/AddTenantModal/AddTenantModal';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ManageLeaseModal from './ManageLeaseModal';
import DocumentRow from '~/components/Documents/DocumentRow';
import DocumentUpload from '~/components/Documents/DocumentUpload';
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
    const { appProviders, listing } = this.props;
    appProviders.listingsProvider.loadListingTenants(listing.id);
    appProviders.documentProvider.getDocumentsForListing(listing.id);
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
        { tenants.map(tenant => (
            <ListGroupItem key={tenant.id} disabled={tenant.disabled} className="property-manage-list-group-item">
              <TenantRow tenant={tenant} listingTitle={listingTitle} showActionButtons/>
            </ListGroupItem>
          )) }
      </ListGroup>
    );
  }

  showAddTenantModal() {
    this.props.appProviders.modalProvider.showInfoModal({
      title: AddTenantModal.title,
      body: <AddTenantModal listing_id={this.props.listing.id} />,
    });
  }

  renderDocuments() {
    const { appStore, listing } = this.props;
    let documents = appStore.documentStore.getDocumentsByListing(listing.id);
    let groupContent;

    if (!documents || documents.length === 0) {
      groupContent = (
        <ListGroupItem className="property-manage-list-group-item" disabled>
          {DocumentRow.getPlaceholderRow()}
        </ListGroupItem>
      );
    } else {
      groupContent = documents.map(document => (
        <ListGroupItem key={document.id} className="property-manage-list-group-item">
          <DocumentRow document={document} />
        </ListGroupItem>
      ));
    }

    return <ListGroup id="documents-list-group">{ groupContent }</ListGroup>;
  }

  render() {
    const { appProviders, listing } = this.props;
    const leaseStats = utils.getListingLeaseStats(listing);
    const leasePeriodLabel = leaseStats.leasePeriod || '-';
    const isActiveListing = appProviders.listingsProvider.isActiveListing(listing);

    return  <Grid fluid className="property-manage">
              <Row className="property-manage-section-title">
                <Col xs={12}>
                  מידע על השכירות:
                </Col>
              </Row>
              <Row className="property-manage-section-content property-manage-lease-period">
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
                  <div className="property-manage-lease-period-start">{leaseStats.leaseStart}</div>
                  <div className="property-manage-lease-period-start-label">תחילת שכירות</div>
                  <div className="property-manage-lease-period-days-passed">{leaseStats.daysPassedLabel} ימים עברו</div>
                  <ProgressBar now={leaseStats.daysPassed <= 0 ? (leaseStats.leasePeriod / 100) : leaseStats.daysPassed} max={leaseStats.leasePeriod}/>
                  <div className="property-manage-lease-period-days-left">{leaseStats.daysLeft} ימים נותרו</div>
                  <div className="property-manage-lease-period-end">{leaseStats.leaseEnd}</div>
                  <div className="property-manage-lease-period-end-label">תום שכירות</div>
                </Col>
              </Row>

              <Row className="property-manage-section-title">
                <Col xs={12}>
                  { isActiveListing ? 'דיירים נוכחיים:' : 'דיירים קודמים:' }
                  <Button onClick={this.showAddTenantModal} className="add-button pull-left">הוסף דייר</Button>
                </Col>
              </Row>
              <Row className="property-manage-section-content">
                {this.renderTenants()}
              </Row>

              <Row className="property-manage-section-title">
                <Col xs={12}>
                  מסמכים:                  
                  <DocumentUpload className="add-button pull-left" listing_id={listing.id} />
                </Col>
              </Row>
              <Row className="property-manage-section-content">
                {this.renderDocuments()}
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
