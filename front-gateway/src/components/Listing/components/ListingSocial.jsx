import React from 'react';
import { Col } from 'react-bootstrap';
import Icon from '~/components/Icon/Icon';

class ListingInfo extends React.Component {
  render() {
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + '/apartments/' + this.props.listing.id;

    return (
      <Col className="listing-social-share-wrapper">
        <div className="listing-social-share-container text-center">
          <span>שתפו את הנכס</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <a className="listing-social-share-item fa fa-facebook-square fb-desktop" href={'https://www.facebook.com/sharer.php?u=' + currentUrl + '?utm_source=apt_page_facebook_share'} target="_blank"></a>
          <a className="listing-social-share-item fa fa-facebook-square fb-mobile" href={'fb://publish/profile/#me?text=' + currentUrl + '?utm_source=apt_page_facebook_share'}></a>
          <a className="listing-social-share-item email fa fa-envelope" href={'mailto:?subject=Great%20apartment%20from%20dorbel&amp;body=' + currentUrl + '?utm_source=apt_page_email_share'}></a>
          <a className="listing-social-share-item whatsapp fa fa-whatsapp" href={'whatsapp://send?text=היי, ראיתי דירה באתר dorbel שאולי תעניין אותך. ' + currentUrl + '?utm_source=apt_page_whatsapp_share'} data-href={currentUrl + '?utm_source=apt_page_whatsapp_share'} data-text="היי, ראיתי דירה באתר dorbel שאולי תעניין אותך."></a>
          <a className="listing-social-share-item fb-messenger-desktop" href={'https://www.facebook.com/dialog/send?app_id=1651579398444396&link=' + currentUrl + '?utm_source=apt_page_messenger_share' + '&redirect_uri=' + currentUrl + '?utm_source=apt_page_messenger_share'} target="_blank"><Icon iconName="dorbel-icon-social-fbmsg" /></a>
          <a className="listing-social-share-item fb-messenger-mobile" href={'fb-messenger://share/?link=' + currentUrl + '?utm_source=apt_page_messenger_share' + '&app_id=1651579398444396'}><Icon iconName="dorbel-icon-social-fbmsg" /></a>
        </div>
      </Col>
    );
  }
}

ListingInfo.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingInfo;
