import React from 'react';
import autobind from 'react-autobind';
import _ from 'lodash';
import { inject } from 'mobx-react';
import { Col, Row, Image } from 'react-bootstrap';
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
    return _.times(4, i => ({ id: i, disabled: true, first_name: 'שם הדייר', picture: 'https://static.dorbel.com/images/icons/user-picture-placeholder.png' }));
  }

  showTenantProfileModal() {
    const { tenant, listing } = this.props;

    if (tenant.disabled) { return; }

    window.analytics.track('client_click_tenant_profile', {
      listing_id: listing.id,
      tenant_id: tenant.dorbel_user_id
    });

    this.props.appProviders.modalProvider.show({
      body: <TenantProfile profile={tenant} listing={listing} />,
      closeButton: true,
      modalSize: 'large'
    });
  }

  handleMsgClick(e) {
    e.stopPropagation(); // Prevent propagation to showTenantProfileModal

    const { tenant, listing } = this.props;
    const { messagingProvider } = this.props.appProviders;

    const withUserObj = {
      id: tenant.dorbel_user_id,
      name: getUserNickname(tenant),
      email: tenant.email,
      welcomeMessage: 'באפשרותך לשלוח הודעה לדיירים עם הפרטים והזמנה לראות דירה.'
    };
    messagingProvider.getOrStartConversation(withUserObj, {
      topicId: listing.id,
      subject: getListingTitle(listing)
    }).then(popup => this.popup = popup);
  }

  removeTenant(e) {
    e.stopPropagation(); // Prevent propagation to showTenantProfileModal

    const { appProviders, tenant, listing } = this.props;

    if (tenant.disabled) { return; }

    let confirmation = appProviders.modalProvider.showConfirmationModal({
      title: 'האם אתם בטוחים?',
      body: <p>לאחר שדייר הוסר מרשימת הדיירים, לא ניתן לבטל את הפעולה ולהחזיר את הדייר לרשימה.</p>,
      confirmButton: 'אני מבין, הסר את הדייר',
    });

    confirmation.then(choice => {
      if (choice) {
        appProviders.likeProvider.set(listing.apartment_id, listing.id, false, tenant)
          .then(() => {
            appProviders.likeProvider.getLikesForListing(listing.id, true);
            appProviders.notificationProvider.success('הדייר הוסר בהצלחה');
            window.analytics.track('client_click_tenant_remove', {
              listing_id: listing.id,
              tenant_id: tenant.dorbel_user_id
            });
          })
          .catch(appProviders.notificationProvider.error);
      }
    }).catch((err) => this.props.appProviders.notificationProvider.error(err));
  }

  render() {
    const { tenant, listing } = this.props;
    const listingTitle = getListingTitle(listing);

    return (
      <Row className="tenant-row" onClick={this.showTenantProfileModal}>
        <Col xs={6}>
          <div className="tenant-row-profile">
            <Image className="tenant-row-image" src={tenant.picture} circle />
            <div className="tenant-row-text">
              <div className="tenant-row-name">{tenant.first_name || 'אנונימי'} {tenant.last_name || ''}</div>
              <div className="tenant-row-position">{tenant.tenant_profile && (tenant.tenant_profile.position || '')}</div>
            </div>
          </div>
        </Col>
        <Col xs={6} className="text-left">
          <div className="tenant-row-remove pull-left">
            <i className="fa fa-times" title="הסר דייר" onClick={this.removeTenant}></i>
          </div>
          {!tenant.disabled && tenant.dorbel_user_id && process.env.TALKJS_PUBLISHABLE_KEY && listingTitle &&
            <div className="tenant-row-button pull-left" onClick={this.handleMsgClick}>
              <i className="fa fa-comment fa-2 tenant-row-msg-icon"></i>
              <span className="tenant-row-button-text">צור קשר</span>
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
