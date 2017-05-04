import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Col, Row, Image } from 'react-bootstrap';
import TenantProfile from '~/components/TenantProfile/TenantProfile';

import './TenantRow.scss';

@inject('appProviders')
export default class TenantRow extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  showTenantProfileModal(profile) {
    console.log(profile);
    this.props.appProviders.modalProvider.showInfoModal({
      title: 'פרופיל דייר',
      body: <TenantProfile profile={profile} />,
    });
  }

  render() {
    const { tenant } = this.props;
    const picUrl = tenant.picture || `https://dummyimage.com/50x50/5A1592/ffffff&text=${tenant.first_name[0] + (tenant.last_name ? tenant.last_name[0] : '')}`;
    const facebookClass = tenant.tenant_profile && tenant.tenant_profile.facebook_url ? '' : 'tenant-row-no-facebook';

    return (
      <Row className="tenant-row" onClick={() => this.showTenantProfileModal(tenant)}>
        <Col xs={3}>
          <Image className="tenant-row-image" src={picUrl} circle />
        </Col>
        <Col xs={5}>
          <span>{tenant.first_name} {tenant.last_name}</span>
        </Col>
        <Col xs={2}>
          <i className={'fa fa-2x fa-facebook-square ' + facebookClass }></i>
        </Col>
        <Col xs={2}>
          ...
        </Col>
      </Row>
    );
  }
}

TenantRow.propTypes = {
  appProviders: React.PropTypes.object,
  tenant: React.PropTypes.object.isRequired
};
