import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col } from 'react-bootstrap';
import Icon from '~/components/Icon/Icon';
import routesHelper from '~/routesHelper';

@inject('appStore') @observer
class ListingSocial extends React.Component {

  render() {
    const listing = this.props.listing;
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + routesHelper.getPropertyPath(listing);

    return (
      <Col>
        שתפו חברים שמחפשים:
        <div className="listing-social-share-container">
          <a className="listing-social-share-item fa fa-facebook-f fb-desktop" href={'https://www.facebook.com/sharer.php?u=' + currentUrl + '?utm_source=app&utm_medium=share&utm_campaign=facebook_share'} target="_blank"></a>
          <a className="listing-social-share-item fa fa-facebook-f fb-mobile" href={'fb://publish/profile/me?text=' + currentUrl + '?utm_source=app&utm_medium=share&utm_campaign=facebook_share'}></a>
          <a className="listing-social-share-item whatsapp fa fa-whatsapp" href={'whatsapp://send?text=היי, ראיתי דירה באתר dorbel שאולי תעניין אותך. ' + currentUrl + '?utm_source=app&utm_medium=share&utm_campaign=whatsapp_share'} data-href={currentUrl + '?utm_source=app&utm_medium=share&utm_campaign=whatsapp_share'} data-text="היי, ראיתי דירה באתר dorbel שאולי תעניין אותך."></a>
          <a className="listing-social-share-item fb-messenger-mobile" href={'fb-messenger://share/?link=' + currentUrl + '?utm_source=app&utm_medium=share&utm_campaign=messenger_share&app_id=1651579398444396'}><Icon iconName="dorbel-icon-social-fbmsg" /></a>
        </div>
      </Col>
    );
  }
}

ListingSocial.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingSocial;
