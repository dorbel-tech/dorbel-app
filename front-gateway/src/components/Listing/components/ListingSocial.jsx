import React from 'react';
import { observer } from 'mobx-react';
import { Col } from 'react-bootstrap';
import Icon from '~/components/Icon/Icon';
import LikeButton from '~/components/LikeButton/LikeButton';

@observer(['appStore'])
class ListingInfo extends React.Component {

  renderLikeCounter() {
    const totalLikes = this.props.listing.totalLikes;
    if (totalLikes && this.props.appStore.authStore.isLoggedIn) {
      return (
        <div className="like-button-total-likes-text">
          <span>
            {`${totalLikes} אוהבים את הדירה`}
          </span>
        </div>
      );
    }
    else {
      return null;
    }
  }

  render() {
    const listingId = this.props.listing.id;
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + '/apartments/' + listingId;

    return (
      <Col className="listing-social-share-wrapper">
        שתפו
        <div className="listing-social-share-container">
          <a className="listing-social-share-item fa fa-facebook-f fb-desktop" href={'https://www.facebook.com/sharer.php?u=' + currentUrl + '?utm_source=apt_page_facebook_share'} target="_blank"></a>
          <a className="listing-social-share-item fa fa-facebook-f fb-mobile" href={'fb://publish/profile/#me?text=' + currentUrl + '?utm_source=apt_page_facebook_share'}></a>
          <a className="listing-social-share-item email fa fa-envelope-o" href={'mailto:?subject=Great%20apartment%20from%20dorbel&amp;body=' + currentUrl + '?utm_source=apt_page_email_share'}></a>
          <a className="listing-social-share-item whatsapp fa fa-whatsapp" href={'whatsapp://send?text=היי, ראיתי דירה באתר dorbel שאולי תעניין אותך. ' + currentUrl + '?utm_source=apt_page_whatsapp_share'} data-href={currentUrl + '?utm_source=apt_page_whatsapp_share'} data-text="היי, ראיתי דירה באתר dorbel שאולי תעניין אותך."></a>
          <a className="listing-social-share-item fb-messenger-desktop" href={'https://www.facebook.com/dialog/send?app_id=1651579398444396&link=' + currentUrl + '?utm_source=apt_page_messenger_share' + '&redirect_uri=' + currentUrl + '?utm_source=apt_page_messenger_share'} target="_blank"><Icon iconName="dorbel-icon-social-fbmsg" /></a>
          <a className="listing-social-share-item fb-messenger-mobile" href={'fb-messenger://share/?link=' + currentUrl + '?utm_source=apt_page_messenger_share' + '&app_id=1651579398444396'}><Icon iconName="dorbel-icon-social-fbmsg" /></a>
        </div>
        <div className="like-button-wrapper text-center">
          <LikeButton listingId={listingId} showText="true" />
          {this.renderLikeCounter()}
        </div>
      </Col>
    );
  }
}

ListingInfo.propTypes = {
  appStore: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingInfo;
