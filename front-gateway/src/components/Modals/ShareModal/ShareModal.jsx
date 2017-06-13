import React, { Component } from 'react';
import ismobilejs from 'ismobilejs';

import './ShareModal.scss';

class ShareModal extends Component {
  static modalSize = 'large';

  renderShareButtons() {
    const { shareUrl } = this.props;
    {
      return ismobilejs.phone ?
        (
          <div>
            <div className="listing-share-modal-button">
              <a href={'fb-messenger://share/?link=' + shareUrl + '?utm_source=apt_page_messenger_share' + '&app_id=1651579398444396'}>
                <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/facebook-messenger.svg" />
              </a>
            </div>
            <div className="listing-share-modal-button">
              <a href={`whatsapp://send?text=${shareUrl}`}>
                <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/whatsapp.svg" />
              </a>
            </div>
            <div className="listing-share-modal-button">
              <a href={'fb://publish/profile/#me?text=' + shareUrl + '?utm_source=apt_page_facebook_share'}>
                <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/facebook.svg" />
              </a>
            </div>
          </div>
        )
        :
        (
          <div className="listing-share-modal-button">
            <a href={'https://www.facebook.com/sharer.php?u=' + shareUrl + '?utm_source=apt_page_facebook_share'}>
              <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/facebook.svg" />
            </a>
          </div>
        );
    }
  }

  render() {
    const { title, content } = this.props;

    return (
      <div className="listing-share-modal">
        <h1 className="listing-share-modal-title">{title}</h1>
        <div className="listing-share-modal-content">
          {content}
        </div>


        <div className="listing-share-modal-contact-us">
          נתקלתם בבעיה? שלחו לנו הודעה דרך העיגול הסגול מימין למטה
        </div>
      </div>
    );
  }
}

ShareModal.propTypes = {
  shareUrl: React.PropTypes.string.isRequired,
  title: React.PropTypes.node,
  content: React.PropTypes.node
};

export default ShareModal;
