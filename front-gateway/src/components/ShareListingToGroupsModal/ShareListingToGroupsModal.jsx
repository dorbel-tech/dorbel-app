import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import Clipboard from 'clipboard';
import _ from 'lodash';
import routesHelper from '~/routesHelper';
import utils from '~/providers/utils';
import localStorageHelper from '~/stores/localStorageHelper';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';

import './ShareListingToGroupsModal.scss';

const DONT_SHOW_AGAIN_PREFIX = "share_listing_dont_show_again_";

@inject('appProviders')
export default class ShareListingToGroupsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
    autobind(this);
  }

  shortUrl: ''
  static title = 'שתפו את המודעה לדיירים שמחפשים דירה ממש עכשיו!';

  static listingHasSharingGroups = (listing) => {
    const allowedCityNames = ['תל אביב יפו', 'רמת גן', 'גבעתיים', 'חולון', 'בת ים'];
    const cityName = _.get(listing, 'apartment.building.city.city_name');
    return allowedCityNames.indexOf(cityName) !== -1;
  }

  static listingGroupShareDismissed = (listing) => {
    return localStorageHelper.getItem(DONT_SHOW_AGAIN_PREFIX + listing.id);
  }

  getShortUrl() {
    const { listing } = this.props;
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + routesHelper.getPropertyPath(listing);
    const shareUrl = utils.getShareUrl(currentUrl, "facebook_group_share", false);
    const { shortUrlProvider } = this.props.appProviders;
    return shortUrlProvider.get(shareUrl)
      .then((shortUrl) => {
        this.shortUrl = shortUrl;
        new Clipboard('.share-listing-to-groups-copy-button');
        this.setState({ isLoading: false });
      })
  }

  componentDidMount() {
    utils.hideIntercom(true);
    this.getShortUrl()
  }

  componentWillUnmount() {
    utils.hideIntercom(false);
  }

  getShareText() {
    const { listing } = this.props;
    const lease_start = utils.formatDate(listing.lease_start);

    return `להשכרה דירת ${listing.apartment.rooms} חד' ברחוב ${listing.apartment.building.street_name}, ${listing.apartment.building.city.city_name}. כניסה ב-${lease_start}, ${listing.apartment.size} מ"ר, שכ"ד ₪${listing.monthly_rent}.
שתפו / שלחו / תייגו חברים שמחפשים!
לפרטים המלאים של הדירה ורישום לחצו על התמונה: ${this.shortUrl}`;
  }

  groupLink(groupId, name, members) {
    return (
      <Button key={groupId} href={'https://www.facebook.com/groups/' + groupId} target="_blank"
        block className="share-listing-to-groups-group-button"
        onClick={() => window.analytics.track('client_click_facebook_group_open')}>
        <span className="share-listing-to-groups-group-name">{name}</span><br />
        <span className="small-text">{members} חברים בקבוצה</span>
        <Glyphicon className="share-listng-group-icon pull-left small-text" glyph="chevron-left" />
      </Button>
    );
  }

  closeModal(dontShowAgain) {
    if (dontShowAgain) {
      localStorageHelper.setItem(DONT_SHOW_AGAIN_PREFIX + this.props.listing.id, true);
      window.analytics.track('client_click_facebook_group_dialog_dont_show');
    } else {
      window.analytics.track('client_click_facebook_group_dialog_show_next_time');
    }
    this.props.appProviders.modalProvider.close();
  }

  renderCityGroups() {
    const { listing } = this.props;
    const cityName = _.get(listing, 'apartment.building.city.city_name');

    switch (cityName) {
      case 'תל אביב יפו':
        return [
          this.groupLink('35819517694', 'דירות מפה לאוזן בת"א', '136,000'),
          this.groupLink('ApartmentsTelAviv', 'דירות להשכרה ריקות או שותפים בתל אביב', '59,000'),
          this.groupLink('dirotTA', 'דירות שלמות ריקות בתל אביב', '57,000'),
          this.groupLink('665278950172707', 'דירות מפה לאוזן תל אביב', '55,000'),
          this.groupLink('543976922383350', 'דירות ת"א secret tel aviv', '42,000')
        ];
      case 'רמת גן':
      case 'גבעתיים':
        return [
          this.groupLink('246902125410185', 'דירות להשכרה ברמת גן / גבעתיים', '38,000'),
          this.groupLink('654949551249110', 'בגבעתיים/רמת גן דירות להשכרה', '10,000'),
          this.groupLink('1504969386441960', 'דירות להשכרה ברמת גן/גבעתיים', '8,000'),
          this.groupLink('1184689764884216', 'דירות הוגנות להשכרה מפה לאוזן - רמת גן גבעתיים', '6,000'),
          this.groupLink('1386194455009158', 'דירות להשכרה בגבעתיים רמת גן', '6,000')
        ];
      case 'חולון':
      case 'בת ים':
        return [
          this.groupLink('212407068826257', 'דירות להשכרה מפה לאוזן חולון -בת ים -ראשון', '11,000'),
          this.groupLink('1444243359219168', 'דירות להשכרה באזור חולון בת-ים', '8,000'),
          this.groupLink('201105170260427', 'דירות  השכרה, חולון,  בת ים, והסביבה', '4,000'),
          this.groupLink('817575694971912', 'דירות להשכרה (ללא תיווך) בת-ים / חולון', '3,000'),
          this.groupLink('1494404674165851', 'דירות להשכרה בת ים - חולון', '1,000')
        ];
    }
  }

  render() {
    return (
      <div className="share-listing-to-groups-modal-body">
        <div>
          <span>הגיעו במהירות לעשות דיירים איכותיים</span>
        </div>
        <div className="share-listing-to-groups-section">
          <b>1 .העתיקו את הטקסט</b> <span className="gray-mid-light-text">(ניתן לשנות אותו בהמשך)</span>
          {
            this.state.isLoading ?
              <LoadingSpinner /> :
              <div>
                <textarea className="share-listing-to-groups-textarea" readOnly rows={3} value={this.getShareText()} />
                <Button className="pull-left share-listing-to-groups-copy-button"
                  data-clipboard-target=".share-listing-to-groups-textarea"
                  onClick={() => window.analytics.track('client_click_facebook_group_share_text_copy')}>
                  העתק טקסט
                </Button>
              </div>
          }
        </div>
        <div className="share-listing-to-groups-section share-listing-to-groups-section-2">
          <b>2. שתפו אותו בקבוצות הפייסבוק הבאות:</b><br />
          <span className="gray-mid-light-text">עליכם להיות חברים בקבוצות אלו כדי שתוכלו לפרסם בהם</span>
          {this.renderCityGroups()}
        </div>
        <div className="share-listing-to-groups-section share-listing-to-groups-section-3">
          <Button bsStyle="link" className="underline" onClick={() => this.closeModal(true)}>אל תציג שוב</Button>
          <Button bsStyle="success" onClick={() => this.closeModal(false)}>בפעם הבאה</Button>
        </div>
      </div>
    );
  }
}
