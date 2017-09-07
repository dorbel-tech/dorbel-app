import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import Clipboard from 'clipboard';
import _ from 'lodash';
import routesHelper from '~/routesHelper';
import utils from '~/providers/utils';
import localStorageHelper from '~/stores/localStorageHelper';

import './ShareListingToGroupsModal.scss';

const DONT_SHOW_AGAIN_PREFIX = "share_listing_dont_show_again_";

@inject('appProviders')
export default class ShareListingToGroupsModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static title = 'שתפו את המודעה לדיירים שמחפשים דירה ממש עכשיו!';

  static shouldShow = (listing) => {
    const city_name = _.get(listing, 'apartment.building.city.city_name');
    return (city_name === 'תל אביב יפו' && !localStorageHelper.getItem(DONT_SHOW_AGAIN_PREFIX + listing.id));
  }

  componentDidMount() {
    utils.hideIntercom(true);
    new Clipboard('.share-listing-to-groups-copy-button');
  }

  componentWillUnmount() {
    utils.hideIntercom(false);
  }

  getShareText() {
    const { listing } = this.props;
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + routesHelper.getPropertyPath(listing);
    const lease_start = utils.formatDate(listing.lease_start);

    return `להשכרה דירת ${listing.apartment.rooms} חד' ברחוב ${listing.apartment.building.street_name}. כניסה ב-${lease_start}, ${listing.apartment.size} מ"ר, שכ"ד ₪${listing.monthly_rent}.
שתפו / שלחו / תייגו חברים שמחפשים!
לפרטים המלאים של הדירה: ${utils.getShareUrl(currentUrl, "facebook_group_share", false)}`;
  }

  groupLink(href, name, members) {
    return (
      <Button href={'https://www.facebook.com/groups/' + href} target="_blank"
              block className="share-listing-to-groups-group-button"
              onClick={() => window.analytics.track('client_click_facebook_group_open')}>
        <span className="share-listing-to-groups-group-name">{name}</span><br/>
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

  render() {
    return (
      <div className="share-listing-to-groups-modal-body">
        <div>
          <span>הגיעו במהירות לעשות דיירים איכותיים</span>
        </div>
        <div className="share-listing-to-groups-section">
          <b>1 .העתיקו את הטקסט</b> <span className="gray-mid-light-text">(ניתן לשנות אותו בהמשך)</span>
          <textarea className="share-listing-to-groups-textarea" readOnly rows={3} value={this.getShareText()} />
          <Button className="pull-left share-listing-to-groups-copy-button"
                  data-clipboard-target=".share-listing-to-groups-textarea"
                  onClick={() => window.analytics.track('client_click_facebook_group_share_text_copy')}>
            העתק טקסט
          </Button>
        </div>
        <div className="share-listing-to-groups-section share-listing-to-groups-section-2">
          <b>2. שתפו אותו בקבוצות הפייסבוק הבאות:</b><br/>
          <span className="gray-mid-light-text">עליכם להיות חברים בקבוצות אלו כדי שתוכלו לפרסם בהם</span>
          { this.groupLink('35819517694', 'דירות מפה לאוזן בת"א', '136,000') }
          { this.groupLink('ApartmentsTelAviv', 'דירות להשכרה ריקות או שותפים בתל אביב', '59,000') }
          { this.groupLink('dirotTA', 'דירות שלמות ריקות בתל אביב', '57,000') }
          { this.groupLink('665278950172707', 'דירות מפה לאוזן תל אביב', '55,000') }
          { this.groupLink('543976922383350', 'דירות ת"א secret tel aviv', '42,000') }
        </div>
        <div className="share-listing-to-groups-section share-listing-to-groups-section-3">
          <Button bsStyle="link" className="underline" onClick={() => this.closeModal(true)}>אל תציג שוב</Button>
          <Button bsStyle="success" onClick={() => this.closeModal(false)}>בפעם הבאה</Button>
        </div>
      </div>
    );
  }
}
