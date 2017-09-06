import React from 'react';
import { inject, observer } from 'mobx-react';
import Icon from '~/components/Icon/Icon';
import routesHelper from '~/routesHelper';

@inject('appStore', 'appProviders') @observer
class ListingSocial extends React.Component {

  render() {
    const { utils } = this.props.appProviders;
    const listing = this.props.listing;
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + routesHelper.getPropertyPath(listing);

    return (
      <div className="listing-social-share-container">
        <a className="listing-social-share-item fa fa-facebook-f" href={'https://www.facebook.com/sharer/sharer.php?app_id=1651579398444396&kid_directed_site=0&sdk=joey&display=popup&ref=plugin&src=share_button&u=' + utils.getShareUrl(currentUrl, 'facebook_share')} target="_blank"></a>
        <a className="listing-social-share-item fb-messenger-mobile" href={'fb-messenger://share/?app_id=1651579398444396&link=' + utils.getShareUrl(currentUrl, 'messenger_share')}><Icon iconName="dorbel-icon-social-fbmsg" /></a>
        <a className="listing-social-share-item whatsapp fa fa-whatsapp" href={'whatsapp://send?text=היי, ראיתי דירה באתר dorbel שאולי תעניין אותך. ' + utils.getShareUrl(currentUrl, 'whatsapp_share')} data-href={utils.getShareUrl(currentUrl, 'whatsapp_share')} data-text="היי, ראיתי דירה באתר dorbel שאולי תעניין אותך."></a>
      </div>
    );
  }
}

ListingSocial.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingSocial;
