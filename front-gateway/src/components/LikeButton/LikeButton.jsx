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
        appProviders.notificationProvider.success('הדירה נשמרה בהצלחה לרשימת הדירות שאתם מעוניינים');
      });
  }

  isProfileFull(profile) {
    const missingRequiredField = TenantProfileEdit.profileRequiredFields.find((fieldName) => { return _.isNil(_.get(profile, fieldName)); });
    return _.isNil(missingRequiredField)
  }

  showEditProfileModalBeforeLiking(profile) {
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
      this.isProfileFull(profile) ?
        this.toggleLiked(true) :
        this.showEditProfileModalBeforeLiking(profile);
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
      <a href="#" className={isLiked ? 'like-button liked' : 'like-button'} onClick={isLiked ? _.noop() : this.handleClick}>
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
