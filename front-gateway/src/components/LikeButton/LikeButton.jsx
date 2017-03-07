import React, { Component } from 'react';
import { observer } from 'mobx-react';

import './LikeButton.scss';

@observer(['appProviders'])
class LikeButton extends Component {
  render() {
    let iconStyle = this.props.appProviders.likeProvider.get(this.props.listingId) ? 'fa-heart' : 'fa-heart-o'; 
    return (<i className={'like-button fa ' + iconStyle} />);
  }
}

LikeButton.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  listingId: React.PropTypes.number.isRequired,
};

export default LikeButton;
