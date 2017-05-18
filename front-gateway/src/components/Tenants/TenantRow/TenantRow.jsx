import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Col, Row, Image, Dropdown, MenuItem } from 'react-bootstrap';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';

import './TenantRow.scss';

@inject('appProviders')
export default class TenantRow extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static getEmptyTenantList() {
    // used as a placeholder for an empty list
    return [
      { id: 0, disabled: true, first_name: 'שם דייר נוכחי', picture: 'https://static.dorbel.com/images/icons/user-picture-placeholder.png' }
    ];
  }

  showTenantProfileModal(tenant) {
    if (tenant.disabled) { return; }

    this.props.appProviders.modalProvider.showInfoModal({
      title: 'פרופיל דייר',
      body: <TenantProfile profile={tenant} />,
    });
  }

  removeTenant(tenant) {
    const { appProviders } = this.props;
    appProviders.listingsProvider.removeTenant(tenant)
    .then(() => appProviders.notificationProvider.success('הדייר הוסר מרשימת השוכרים הנוכחיים שלך'))
    .catch(appProviders.notificationProvider.error);
  }

  render() {
    const { tenant, showActionButtons } = this.props;
    // setting showProfile on the columns separatley so the dropdown menu won't trigger the profile modal
    const showProfile = () => this.showTenantProfileModal(tenant);
    const facebookClass = tenant.tenant_profile && tenant.tenant_profile.facebook_url ? '' : 'tenant-row-no-facebook';

    return (
      <Row className="tenant-row">
        <Col xs={2} md={1} onClick={showProfile}>
          <Image className="tenant-row-image" src={tenant.picture} circle />
        </Col>
        <Col xs={6} md={7} onClick={showProfile}>
          <span>{tenant.first_name || 'אנונימי'} {tenant.last_name || ''}</span>
        </Col>
        <Col xs={2} onClick={showProfile}>
          <i className={'fa fa-2x fa-facebook-square ' + facebookClass}></i>
        </Col>
        { showActionButtons ?
          <Col xs={2}>
            <Dropdown id={'tenant' + tenant.id} className="pull-left" disabled={tenant.disabled}>
              <Dropdown.Toggle noCaret bsStyle="link">
                <i className="fa fa-ellipsis-v" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-left">
                <MenuItem onClick={() => this.removeTenant(tenant)}>הסר דייר</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          :
          null
        }
      </Row>
    );
  }
}

TenantRow.propTypes = {
  appProviders: React.PropTypes.object,
  tenant: React.PropTypes.object.isRequired,
  showActionButtons: React.PropTypes.bool
};
