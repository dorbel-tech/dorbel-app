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

  showTenantProfileModal(profile) {
    this.props.appProviders.modalProvider.showInfoModal({
      title: 'פרופיל דייר',
      body: <TenantProfile profile={profile} />,
    });
  }

  removeTenant(tenant) {
    const { appProviders } = this.props;
    appProviders.listingsProvider.removeTenant(tenant)
    .then(() => appProviders.notificationProvider.success('הדייר הוסר מרשימת השוכרים הנוכחיים שלך'))
    .catch(appProviders.notificationProvider.error);
  }

  render() {
    const { tenant } = this.props;
    // setting showProfile on the columns separatley so the dropdown menu won't trigger the profile modal
    const showProfile = () => this.showTenantProfileModal(tenant);
    const facebookClass = tenant.tenant_profile && tenant.tenant_profile.facebook_url ? '' : 'tenant-row-no-facebook';

    return (
      <Row className="tenant-row">
        <Col xs={3} onClick={showProfile}>
          <Image className="tenant-row-image" src={tenant.picture} circle />
        </Col>
        <Col xs={5} onClick={showProfile}>
          <span>{tenant.first_name} {tenant.last_name}</span>
        </Col>
        <Col xs={2} onClick={showProfile}>
          <i className={'fa fa-2x fa-facebook-square ' + facebookClass}></i>
        </Col>
        <Col xs={2}>
          <Dropdown id={'tenant' + tenant.id} className="pull-left">
            <Dropdown.Toggle noCaret bsStyle="link">
              <i className="fa fa-ellipsis-v" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-left">
              <MenuItem onClick={() => this.removeTenant(tenant)}>הסר דייר</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    );
  }
}

TenantRow.propTypes = {
  appProviders: React.PropTypes.object,
  tenant: React.PropTypes.object.isRequired
};
