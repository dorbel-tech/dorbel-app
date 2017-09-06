import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
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
    const { notificationProvider, modalProvider, navProvider, likeProvider } = appProviders;
    likeProvider.set(apartmentId, listingId, isLiked)
      .then(() => {
        notificationProvider.success('הדירה נשמרה בהצלחה לרשימת הדירות שאתם מעוניינים');
        modalProvider.showInfoModal({
          title: 'בעל הדירה קיבל את פנייתך ויוכל לחזור אליך בהקדם',
          body: (
            <Button href={'/search'} onClick={navProvider.handleHrefClick} bsStyle="success">
              <i className="fa fa-home" />
              מדהים, הראו לי דירות נוספות
            </Button>
          )
        })
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
