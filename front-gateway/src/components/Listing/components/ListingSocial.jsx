import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col } from 'react-bootstrap';
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
      <Col>
        שתפו חברים שמחפשים:
        <div className="listing-social-share-container">
          <div className="listing-social-share-item fb-share-button" data-href={utils.getShareUrl(currentUrl, 'facebook_share')} data-layout="button" data-size="small" data-mobile-iframe="false"><a className="fb-xfbml-parse-ignore" target="_blank" href={'https://www.facebook.com/sharer/sharer.php?u=' + utils.getShareUrl(currentUrl, 'facebook_share', true) + '&amp;src=sdkpreparse'}></a></div>
          <div className="listing-social-share-item fb-send" data-href={utils.getShareUrl(currentUrl, 'messenger_share')}></div>
          <a className="listing-social-share-item whatsapp fa fa-whatsapp" href={'whatsapp://send?text=היי, ראיתי דירה באתר dorbel שאולי תעניין אותך. ' + utils.getShareUrl(currentUrl, 'whatsapp_share')} data-href={utils.getShareUrl(currentUrl, 'whatsapp_share')} data-text="היי, ראיתי דירה באתר dorbel שאולי תעניין אותך."></a>
        </div>
      </Col>
    );
  }
}

ListingSocial.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingSocial;
