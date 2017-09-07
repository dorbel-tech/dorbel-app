import React from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import Clipboard from 'clipboard';
import routesHelper from '~/routesHelper';

@inject('appStore', 'appProviders') @observer
class ListingSocial extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    new Clipboard('.listing-social-copy-button').on('success', this.urlCopiedToClipboard);
  }

  render() {
    const { utils } = this.props.appProviders;
    const listing = this.props.listing;
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + routesHelper.getPropertyPath(listing);

    return (
      <div className="listing-social-share-container">
        <i className="listing-social-share-item fa fa-link listing-social-copy-button" title="העתק לינק" data-clipboard-text={utils.getShareUrl(currentUrl, 'custom_share', false)} />
        <a className="listing-social-share-item fa fa-facebook-f"  title="שתף מודעה בפייסבוק" onClick={() => this.shareTo('facebook', currentUrl)}></a>
        <a className="listing-social-share-item whatsapp fa fa-whatsapp" onClick={() => this.shareTo('whatsapp', currentUrl)}></a>
      </div>
    );
  }

  shareTo(socialNetwork, currentUrl) {
    const { utils } = this.props.appProviders;
    let shareUrl;

    switch(socialNetwork) {
      case 'facebook':
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?app_id=1651579398444396&kid_directed_site=0&sdk=joey&display=popup&ref=plugin&src=share_button&u=' + utils.getShareUrl(currentUrl, 'facebook_share');
        break;
      case 'whatsapp':
        shareUrl = 'whatsapp://send?text=היי, ראיתי דירה באתר dorbel שאולי תעניין אותך. ' + utils.getShareUrl(currentUrl, 'whatsapp_share');
        break;
    }

    window.open(shareUrl)
    window.analytics.track('client_click_share_' + socialNetwork);
  }

  urlCopiedToClipboard() {
    const { notificationProvider } = this.props.appProviders;
    notificationProvider.success('הקישור הועתק בהצלחה');
    window.analytics.track('client_click_share_link_copy');
  }
}

ListingSocial.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingSocial;
