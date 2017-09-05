import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Col, Row, Image, Dropdown, MenuItem } from 'react-bootstrap';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';
import { getUserNickname, hideIntercom, getListingTitle } from '~/providers/utils';

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
    const { tenant, listing } = this.props;
    if (tenant.disabled) { return; }

    this.props.appProviders.modalProvider.show({
      body: <TenantProfile profile={tenant} listing={listing} />,
    });
  }

  handleMsgClick() {
    const { tenant, listing } = this.props;
    const { messagingProvider } = this.props.appProviders;

    const withUserObj = {
      id: tenant.dorbel_user_id,
      name: getUserNickname(tenant),
      email: tenant.email,
      welcomeMessage: 'באפשרותך לשלוח הודעה לדיירים. במידה והם אינם מחוברים הודעתך תישלח אליהם למייל.'
    };
    messagingProvider.getOrStartConversation(withUserObj, {
      topicId: listing.id,
      subject: getListingTitle(listing)
    }).then(popup => this.popup = popup);
  }

  removeTenant() {
    const { appProviders, tenant, listing } = this.props;

    appProviders.likeProvider.set(listing.apartment_id, listing.id, false, tenant.id)
      .then(() => {
        const likeNotification = 'הדייר הוסר בהצלחה';
        appProviders.notificationProvider.success(likeNotification);
      })
      .catch(appProviders.notificationProvider.error);
  }

  render() {
    const { tenant, listing } = this.props;
    const listingTitle = getListingTitle(listing);

    return (
      <Row className="tenant-row">
        <Col xs={6} lg={6} onClick={this.showTenantProfileModal}>
          <Image className="tenant-row-image" src={tenant.picture} circle />
          <span>{tenant.first_name || 'אנונימי'} {tenant.last_name || ''}</span>
        </Col>
        <Col xs={6} lg={6} className="text-left">
          <Dropdown id={'tenant' + tenant.id} className="pull-left" disabled={tenant.disabled}>
            <Dropdown.Toggle noCaret bsStyle="link">
              <i className="fa fa-ellipsis-v" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-left">
              <MenuItem onClick={this.removeTenant}>הסר דייר</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
          {!tenant.disabled && tenant.dorbel_user_id && process.env.TALKJS_PUBLISHABLE_KEY && listingTitle &&
            <div className="tenant-row-button pull-left" onClick={this.handleMsgClick}>
              <span className="tenant-row-button-text">שלח הודעה</span>
              <i className="fa fa-comments tenant-row-msg-icon"></i>
            </div>
          }
          {!tenant.disabled &&
            <div className="tenant-row-button pull-left" onClick={this.showTenantProfileModal}>
              <span className="tenant-row-button-text">הראה פרופיל</span>
              <i className="fa fa-user"></i>
            </div>
          }
        </Col>
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
  listing: React.PropTypes.object.isRequired,
  showActionButtons: React.PropTypes.bool,
  mode: React.PropTypes.string
};
