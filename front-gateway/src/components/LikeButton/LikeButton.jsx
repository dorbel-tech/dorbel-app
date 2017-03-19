import React, { Component } from 'react';
import { observer } from 'mobx-react';

import './LikeButton.scss';

@observer(['appProviders', 'appStore'])
class LikeButton extends Component {

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.props.appStore.authStore.isLoggedIn) {
      let prevState = this.props.appProviders.likeProvider.get(this.props.listingId);
      this.props.appProviders.likeProvider.set(this.props.listingId, !prevState);
    }
    else {
      this.props.appProviders.authProvider.showLoginModal();
    }
  }

  getWrapperClass(showText, isLiked) {
    let wrapperClass = 'like-button ';
    if (showText){
      wrapperClass += 'with-text ';
    }

    if (isLiked) {
      wrapperClass += 'liked';
    }

    return wrapperClass;
  }

  getIconClass(isLiked) {
    return isLiked ? 'fa-heart' : 'fa-heart-o';
  }

  render() {
    let isLiked = false;

    if (this.props.appStore.authStore.isLoggedIn) {
      isLiked = this.props.appProviders.likeProvider.get(this.props.listingId);
    }

    return (
      <a href="#" className={this.getWrapperClass(this.props.showText, isLiked)} onClick={this.handleClick.bind(this)}>
        <i className={'fa ' + this.getIconClass(isLiked)} />
        <div className="button-text">אהבתי</div>
      </a>
    );
  }
}

LikeButton.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
  listingId: React.PropTypes.number.isRequired,
  showText: React.PropTypes.string
};

export default LikeButton;
