import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './LikeButton.scss';

@inject('appStore', 'appProviders') @observer
class LikeButton extends Component {

  handleClick(e) {
    const { apartmentId, listingId, appStore, appProviders } = this.props;

    e.stopPropagation();
    e.preventDefault();

    if (appStore.authStore.isLoggedIn) {
      let wasLiked = appProviders.likeProvider.get(apartmentId);
      appProviders.likeProvider.set(apartmentId, listingId, !wasLiked)
      .then(() => {
        const likeNotification = wasLiked ?
          'הדירה הוסרה בהצלחה מרשימת הדירות שאהבתם' :
          'הדירה נשמרה בהצלחה לרשימת הדירות שאהבתם';
        appProviders.notificationProvider.success(likeNotification);
      });

      // Update listing.totalLikes if exists in listingStore
      let listing = appStore.listingStore.get(listingId);
      if (listing) {
        listing.totalLikes = listing.totalLikes || 0;
        listing.totalLikes = wasLiked ? listing.totalLikes - 1 : listing.totalLikes + 1;
        appStore.listingStore.set(listing);
      }
    }
    else {
      appProviders.authProvider.showLoginModal();
    }
  }

  getWrapperClass(showText, isLiked) {
    let wrapperClass = 'like-button ';
    if (showText) {
      wrapperClass += 'like-button-with-text ';
    }

    if (isLiked) {
      wrapperClass += 'like-button-liked';
    }

    return wrapperClass;
  }

  render() {
    let isLiked = false;

    if (this.props.appStore.authStore.isLoggedIn) {
      isLiked = this.props.appProviders.likeProvider.get(this.props.apartmentId);
    }

    return (
      <a href="#" className={this.getWrapperClass(this.props.showText, isLiked)} onClick={this.handleClick.bind(this)}>
        <div className="text-center">
          <i className="fa fa-heart"/>
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
  showText: React.PropTypes.bool
};

export default LikeButton;
