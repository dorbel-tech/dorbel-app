import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Col, Row, Image, Dropdown, MenuItem } from 'react-bootstrap';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';
import { getUserNickname, hideIntercom } from '~/providers/utils';

import './TenantRow.scss';

@inject('appProviders')
export default class TenantRow extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentWillUnmount() {
    this.popup && this.popup.destroy();
    hideIntercom(false);
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
      body: <TenantProfile profile={tenant} />
    });
  }

  handleMsgClick() {
    const { tenant, listingTitle } = this.props;
    const { messagingProvider } = this.props.appProviders;

    const withUserObj = {
      id: tenant.dorbel_user_id,
      name: getUserNickname(tenant),
      email: tenant.email,
      welcomeMessage: 'באפשרותך לשלוח הודעה לדיירים. במידה והם אינם מחוברים הודעתך תישלח אליהם למייל.'
    };
    messagingProvider.getOrStartConversation(withUserObj, {
      topicId: tenant.listing_id,
      subject: listingTitle
    }).then(popup => this.popup = popup);
  }

  removeTenant() {
    const { appProviders, tenant } = this.props;
    appProviders.listingsProvider.removeTenant(tenant)
      .then(() => appProviders.notificationProvider.success('הדייר הוסר מרשימת השוכרים הנוכחיים שלך'))
      .catch(appProviders.notificationProvider.error);
  }

  render() {
    const { tenant, showActionButtons, listingTitle } = this.props;
    const facebookClass = tenant.tenant_profile && tenant.tenant_profile.facebook_url ? '' : 'tenant-row-no-facebook';

    return (
      <Row className="tenant-row">
        <Col xs={2} md={this.props.mode == 'responsive' ? 1 : 2} onClick={this.showTenantProfileModal}>
          <Image className="tenant-row-image" src={tenant.picture} circle />
        </Col>
        <Col xs={6} md={7} onClick={this.showTenantProfileModal}>
          <span>{tenant.first_name || 'אנונימי'} {tenant.last_name || ''}</span>
        </Col>
        <Col xs={1}>
          {!tenant.disabled && <i className={'fa fa-2x fa-facebook-square ' + facebookClass} onClick={this.showTenantProfileModal}></i>}
        </Col>
        <Col xs={1}>
          {!tenant.disabled && tenant.dorbel_user_id && process.env.TALKJS_PUBLISHABLE_KEY && listingTitle &&
            <i className="fa fa-comment tenant-row-msg-icon" onClick={this.handleMsgClick}></i>}
        </Col>
        {showActionButtons ?
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

TenantRow.defaultProps = {
  mode: 'responsive'
};

TenantRow.propTypes = {
  appProviders: React.PropTypes.object,
  tenant: React.PropTypes.object.isRequired,
  listingTitle: React.PropTypes.string,
  showActionButtons: React.PropTypes.bool,
  mode: React.PropTypes.string
};
