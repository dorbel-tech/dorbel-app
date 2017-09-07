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
    new Clipboard('.share-listing-to-groups-copy-button');
  }

  getShareText() {
    const { listing } = this.props;
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + routesHelper.getPropertyPath(listing);
    const lease_start = utils.formatDate(listing.lease_start);

    return `להשכרה! דירת ${listing.apartment.rooms} חד' ברחוב ${listing.apartment.building.street_name}
כניסה ב-${lease_start}, ${listing.apartment.size} מ"ר, שכ"ד ₪${listing.monthly_rent}.
שתפו / שלחו / תייגו חברים שמחפשים !
${currentUrl}`;
  }

  groupLink(href, name, members) {
    return (
      <Button href={'https://www.facebook.com/groups/' + href} target="_blank"
              block className="share-listing-to-groups-group-button">
        <span className="share-listing-to-groups-group-name">{name}</span><br/>
        <span className="small-text">{members} חברים בקבוצה</span>
        <Glyphicon className="pull-left small-text" glyph="chevron-left" />
      </Button>
    );
  }

  closeModal(dontShowAgain) {
    if (dontShowAgain) {
      localStorageHelper.setItem(DONT_SHOW_AGAIN_PREFIX + this.props.listing.id, true);
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
          <b>1 .העתיקו את הטקסט</b><br/>
          <span className="gray-mid-light-text">(ניתן לשנות אותו בהמשך)</span>
          <textarea className="share-listing-to-groups-textarea" readOnly rows={4} value={this.getShareText()} />
          <Button className="pull-left share-listing-to-groups-copy-button"
                  data-clipboard-target=".share-listing-to-groups-textarea">
            העתק טקסט
          </Button>
        </div>
        <div className="share-listing-to-groups-section share-listing-to-groups-section-2">
          <b>2. שתפו אותו בקבוצות הבאות:</b>
          { this.groupLink('35819517694', 'דירות מפה לאוזן בת"א', '136,000') }
          { this.groupLink('ApartmentsTelAviv', 'דירות להשכרה ריקות או שותפים בתל אביב', '59,000') }
          { this.groupLink('dirotTA', 'דירות שלמות ריקות בתל אביב', '57,000') }
          { this.groupLink('665278950172707', 'דירות מפה לאוזן תל אביב', '55,000') }
          { this.groupLink('543976922383350', 'secret tel aviv דירות ת"א', '42,000') }
        </div>
        <div className="share-listing-to-groups-section share-listing-to-groups-section-3">
          <Button bsStyle="link" className="underline" onClick={() => this.closeModal(true)}>אל תציג שוב</Button>
          <Button bsStyle="success" onClick={() => this.closeModal(false)}>בפעם הבאה</Button>
        </div>
      </div>
    );
  }
}
