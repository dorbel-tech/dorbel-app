import React, { Component } from 'react';
import { observer } from 'mobx-react';

import './LikeButton.scss';

@observer(['appProviders', 'appStore'])
class LikeButton extends Component {

  handleClick(e) {
    e.stopPropagation();
    if (this.props.appStore.authStore.isLoggedIn) {
      let prevState = this.props.appProviders.likeProvider.get(this.props.listingId);
      this.props.appProviders.likeProvider.set(this.props.listingId, !prevState);
    }
    else {
      this.props.appProviders.authProvider.showLoginModal();
    }
  }

  render() {
    let iconStyle = 'fa-heart-o';
    if (this.props.appStore.authStore.isLoggedIn) {
      iconStyle = this.props.appProviders.likeProvider.get(this.props.listingId) ? 'fa-heart' : iconStyle;
    }

    return (
      <a href="#" onClick={this.handleClick.bind(this)}>
        <i className={'like-button fa ' + iconStyle} />
      </a>
    );
  }
}

LikeButton.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
  listingId: React.PropTypes.number.isRequired,
};

export default LikeButton;
