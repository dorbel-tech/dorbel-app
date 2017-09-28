import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
import autobind from 'react-autobind';
import _ from 'lodash';

import './LikeButton.scss';

import TenantProfileEdit from '../Tenants/TenantProfile/TenantProfileEdit';

@inject('appStore', 'appProviders') @observer
class LikeButton extends Component {

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    if (this.props.appStore.authStore.isLoggedIn) {
      if (this.props.appStore.authStore.actionBeforeLogin == 'likeListing') {
        this.props.appStore.authStore.actionBeforeLogin = undefined;
        this.handleClick();
      }
    }
  }

  toggleLiked(isLiked) {
    const { apartmentId, listingId, appProviders } = this.props;
    const { notificationProvider, modalProvider, navProvider, likeProvider } = appProviders;
    likeProvider.set(apartmentId, listingId, isLiked)
      .then(() => {
        notificationProvider.success('הדירה נשמרה בהצלחה לרשימת הדירות שאתם מעוניינים');
        modalProvider.showInfoModal({
          closeButton: true,
          title: 'בעל הדירה קיבל את פנייתך ויוכל לחזור אליך בהקדם',
          body: (
            <div className="like-confirm-dialog">
              <p>בינתיים, מצאו דירות נוספות שמתאימות לכם!<br/>
              הגדירו אילו דירות אתם מחפשים וקבלו ישירות למייל עדכונים על דירות חדשות לפני כולם!</p>
              <Button href={'/search'} onClick={navProvider.handleHrefClick} bsStyle="success" className="like-confirm-button">
                <i className="fa fa-home" />
                צור חיפוש חכם
              </Button>
            </div>
          ),
          modalSize: 'large'
        });
      })
      .catch(err => notificationProvider.error(err));
  }

  isProfileFull(profile) {
    const missingRequiredField = TenantProfileEdit.profileRequiredFields.find((fieldName) => { return _.isNil(_.get(profile, fieldName)); });
    return _.isNil(missingRequiredField);
  }

  showEditProfileModalBeforeLiking() {
    const { modalProvider } = this.props.appProviders;
    return modalProvider.show({
      closeButton: true,
      title: TenantProfileEdit.title,
      body: <TenantProfileEdit />,
      modalSize: 'large',
      closeHandler: (isOK) => { if (isOK) { this.toggleLiked(true); } }
    });
  }

  handleClick() {
    const { apartmentId, appStore, appProviders } = this.props;
    const { likeProvider, notificationProvider, authProvider } = appProviders;

    window.analytics.track('client_click_interested_in_apartment');

    if (appStore.authStore.isLoggedIn) {
      const isLiked = likeProvider.get(apartmentId) || false;
      if (isLiked) {
        notificationProvider.success('כבר יצרתם קשר עם בעל דירה זה');
        window.analytics.track('client_click_interested_in_apartment_already');
      }
      else {
        window.analytics.track('client_click_interested_in_apartment_fill_tenant_profile');
        this.showEditProfileModalBeforeLiking();
      }
    }
    else {
      authProvider.showLoginModal({ actionBeforeLogin: 'likeListing' });
      window.analytics.track('client_click_interested_in_apartment_login');
    }
  }

  render() {
    let isLiked = false;

    if (this.props.appStore.authStore.isLoggedIn) {
      isLiked = this.props.appProviders.likeProvider.get(this.props.apartmentId);
    }

    return (
      <a href="#" className={isLiked ? 'like-button liked' : 'like-button'} onClick={this.handleClick}>
        <div className="text-center">
          <i className="fa fa-heart" />
          <span className="like-button-text">לשליחה לחצו כאן</span>
        </div>
      </a>
    );
  }
}

LikeButton.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
  apartmentId: React.PropTypes.number.isRequired,
  listingId: React.PropTypes.number.isRequired,
};

export default LikeButton;
