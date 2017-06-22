import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Col, Row, Image, Dropdown, MenuItem } from 'react-bootstrap';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';
import { setIntercomStyle } from '~/providers/utils';

import './TenantRow.scss';

@inject('appProviders')
export default class TenantRow extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentWillUnmount() {
    this.popup && this.popup.destroy();
    setIntercomStyle('block');
  }

  static getEmptyTenantList() {
    // used as a placeholder for an empty list
    return [
      { id: 0, disabled: true, first_name: 'שם דייר נוכחי', picture: 'https://static.dorbel.com/images/icons/user-picture-placeholder.png' }
    ];
  }

  showTenantProfileModal() {
    const { tenant } = this.props;
    if (tenant.disabled) { return; }

    this.props.appProviders.modalProvider.showInfoModal({
      title: 'פרופיל דייר',
      body: <TenantProfile profile={tenant} />,
    });
  }

  handleMsgClick() {
    const { tenant } = this.props;
    const { messagingProvider } = this.props.appProviders;

    const withUserObj = {
      id: tenant.dorbel_user_id,
      name: tenant.first_name,
      email: tenant.email,
      configuration: 'general'
    };
    const conversation = messagingProvider.getOrStartConversation(withUserObj, {
      topicId: tenant.listing_id
      // TODO: Missing subject
    });

    global.window.Talk.ready.then(() => {
      this.popup = messagingProvider.talkSession.createPopup(conversation);
      this.popup.mount();

      setIntercomStyle('none');
    });
  }

  removeTenant() {
    const { appProviders, tenant } = this.props;
    appProviders.listingsProvider.removeTenant(tenant)
    .then(() => appProviders.notificationProvider.success('הדייר הוסר מרשימת השוכרים הנוכחיים שלך'))
    .catch(appProviders.notificationProvider.error);
  }

  render() {
    const { tenant, showActionButtons } = this.props;
    const facebookClass = tenant.tenant_profile && tenant.tenant_profile.facebook_url ? '' : 'tenant-row-no-facebook';

    return (
      <Row className="tenant-row">
        <Col xs={2} md={1} onClick={this.showTenantProfileModal}>
          <Image className="tenant-row-image" src={tenant.picture} circle />
        </Col>
        <Col xs={6} md={7} onClick={this.showTenantProfileModal}>
          <span>{tenant.first_name || 'אנונימי'} {tenant.last_name || ''}</span>
        </Col>
        <Col xs={2}>
          {!tenant.disabled && <i className={'fa fa-2x fa-facebook-square ' + facebookClass} onClick={this.showTenantProfileModal}></i>}
          {!tenant.disabled && <i className="fa fa-comment tenant-row-msg-icon" onClick={this.handleMsgClick}></i>}
        </Col>
        { showActionButtons ?
          <Col xs={2}>
            <Dropdown id={'tenant' + tenant.id} className="pull-left" disabled={tenant.disabled}>
              <Dropdown.Toggle noCaret bsStyle="link">
                <i className="fa fa-ellipsis-v" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-left">
                <MenuItem onClick={this.removeTenant}>הסר דייר</MenuItem>
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
