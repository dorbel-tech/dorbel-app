import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ismobilejs from 'ismobilejs';

import './ShareModal.scss';

@inject('appProviders') @observer
class ShareModal extends Component {
  static modalSize = 'large';

  renderShareButtons(utils, shareUrl) {
    {
      return ismobilejs.phone ?
        (
          <div>
            <div className="listing-share-modal-button">
              <a href={'fb-messenger://share/?app_id=1651579398444396&link=' + utils.getShareUrl(shareUrl, 'messenger_share')}>
                <img src="https://static.dorbel.com/images/icons/facebook-messenger.svg" />
              </a>
            </div>
            <div className="listing-share-modal-button">
              <a href={`whatsapp://send?text=${this.getShareUrl('whatsapp_share')}`}>
                <img src="https://static.dorbel.com/images/icons/whatsapp.svg" />
              </a>
            </div>
            <div className="listing-share-modal-button">
              <a href={'https://www.facebook.com/sharer.php?u=' + utils.getShareUrl(shareUrl, 'facebook_share')} target="_blank">
                <img src="https://static.dorbel.com/images/icons/facebook.svg" />
              </a>
            </div>
          </div>
        )
        :
        (
          <div className="listing-share-modal-button">
            <a href={'https://www.facebook.com/sharer.php?u=' + utils.getShareUrl(shareUrl, 'facebook_share')} target="_blank">
              <img src="https://static.dorbel.com/images/icons/facebook.svg" />
            </a>
          </div>
        );
    }
  }

  render() {
    const { utils } = this.props.appProviders;
    const { title, content, shareUrl } = this.props;

    return (
      <div className="listing-share-modal">
        <h1 className="listing-share-modal-title">{title}</h1>
        <div className="listing-share-modal-content">
          {content}
        </div>
        {this.renderShareButtons(utils, shareUrl)}
        <div className="listing-share-modal-contact-us">
          נתקלתם בבעיה? שלחו לנו הודעה דרך העיגול הסגול מימין למטה
        </div>
      </div>
    );
  }
}

ShareModal.propTypes = {
  appProviders: React.PropTypes.object,
  shareUrl: React.PropTypes.string.isRequired,
  title: React.PropTypes.node,
  content: React.PropTypes.node
};

export default ShareModal;
