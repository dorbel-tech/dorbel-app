import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import _ from 'lodash';

import './LikeButton.scss';

import TenantProfileEdit from '../Tenants/TenantProfile/TenantProfileEdit'

@inject('appStore', 'appProviders') @observer
class LikeButton extends Component {

  constructor(props) {
    super(props);
    autobind(this);
  }

  toggleLiked(isLiked) {
    const { apartmentId, listingId, appProviders } = this.props;
    appProviders.likeProvider.set(apartmentId, listingId, isLiked)
      .then(() => {
        const likeNotification = isLiked ?
          'הדירה הוסרה בהצלחה מרשימת הדירות שאהבתם' :
          'הדירה נשמרה בהצלחה לרשימת הדירות שאהבתם';
        appProviders.notificationProvider.success(likeNotification);
      });
  }

  isProfileFull(profile) {
    const values = _.pick(profile, TenantProfileEdit.profileRequiredFields);
    const hasUndefinedField = _.find(values, value => !!value);
    return !hasUndefinedField;
  }

  showEditProfileModal(profile) {
    const { modalProvider } = this.props.appProviders;
    return modalProvider.show({
      title: TenantProfileEdit.title,
      body: <TenantProfileEdit profile={profile} />,
      closeHandler: (wasCreated) => { if (wasCreated) { this.handleClick() } }
    })
  }

  handleClick() {
    const { apartmentId, listingId, appStore, appProviders } = this.props;

    if (appStore.authStore.isLoggedIn) {
      const { profile } = this.props.appStore.authStore;
      if (this.isProfileFull(profile)) {
        const wasLiked = appProviders.likeProvider.get(apartmentId);
        this.toggleLiked(!wasLiked);
      }
      else {
        this.showEditProfileModal(profile);
      }
    }
    else {
      appProviders.authProvider.showLoginModal();
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
          <span className="like-button-text">אני מעוניין/ת בדירה</span>
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
