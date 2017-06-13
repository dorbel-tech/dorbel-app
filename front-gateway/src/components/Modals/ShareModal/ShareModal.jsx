import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ismobilejs from 'ismobilejs';

import './ShareModal.scss';

class ShareModal extends Component {
  static modalSize = 'large';

  render() {
    const { shareUrl, title, heading, headingBold, content } = this.props;

    return (
      <div className="listing-share-modal">
        <h1 className="listing-share-modal-title">{title}</h1>
        <div className="listing-share-modal-heading">
          {heading}
          <span className="bold">
            {headingBold}
          </span>
        </div>
        <div className="listing-share-modal-body-text">
          {content}
        </div>
        {ismobilejs.phone ?
          (
            <div>
              <div className="listing-share-modal-button-wrapper">
                <Button
                  href={'fb-messenger://share/?link=' + shareUrl + '?utm_source=apt_page_messenger_share' + '&app_id=1651579398444396'}>
                  שתפו ב-
                    &nbsp;
                    <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/facebook-messenger.svg" />
                </Button>
              </div>
              <div className="listing-share-modal-button-wrapper">
                <Button
                  href={`whatsapp://send?text=${shareUrl}`}>
                  שתפו ב
                    -&nbsp;
                <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/whatsapp.svg" />
                </Button>
              </div>
              <div className="listing-share-modal-button-wrapper">
                <Button
                  href={'fb://publish/profile/#me?text=' + shareUrl + '?utm_source=apt_page_facebook_share'}>
                  שתפו ב-
                    &nbsp;
                    <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/facebook.svg" />
                </Button>
              </div>
            </div>
          )
          :
          (
            <div className="listing-share-modal-button-wrapper">
              <Button
                href={'https://www.facebook.com/sharer.php?u=' + shareUrl + '?utm_source=apt_page_facebook_share'}
                className="rented-congrats-modal-button" >
                שתפו ב-
                  &nbsp;
                <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/facebook.svg" />
              </Button>
            </div>
          )
        }
        <div className="listing-share-modal-contact-us">
          לשאלות נוספות ויצירת קשר בנוגע לדירה שלחו לנו מייל: <a href="mailto:homesupport@dorbel.com">homesupport@dorbel.com</a>
        </div>
      </div>
    );
  }
}

ShareModal.propTypes = {
  shareUrl: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  heading: React.PropTypes.string,
  headingBold: React.PropTypes.string,
  content: React.PropTypes.string
};

export default ShareModal;
