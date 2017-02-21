import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Row } from 'react-bootstrap';
import autobind from 'react-autobind';
import Icon from '../Icon/Icon';

import OHERegisterModal from './OHERegisterModal';
import FollowListingModal from './FollowListingModal';

@observer(['appStore', 'appProviders', 'router'])
class OHEList extends Component {
  constructor(props) {
    super(props);
    this.state = { oheForModal: null };
    autobind(this);
  }

  renderListItem(params) {
    const { router } = this.props;
    const callToActionTextClass = params.callToActionTextClass || '';
    let className = 'list-group-item';
    let onClickFunction = () => {
      const currentRoute = router.getRoute().join('/');
      router.setRoute(`/${currentRoute}/${params.onClickRoute}`);
    };

    if (params.isDisabled) {
      onClickFunction = null;
      className += ' disabled';
    }

    return (
      <a key={params.key} className={className} onClick={onClickFunction}>
        <Row>
          <div className="dorbel-icon-calendar pull-right">
            <Icon iconName={params.iconName} />
          </div>
          <div className="date-and-time pull-right">
            <span className={params.highlightTitle ? 'highlight' : ''}>{params.itemText}</span>
            <br />
            <span className={callToActionTextClass}>{params.callToActionText}</span>
          </div>
          <div className="dorbel-icon-arrow fa fa-chevron-left pull-left"></div>
        </Row>
      </a>
    );
  }

  renderOpenHouseEvent(openHouseEvent) {
    const OHEConfig = this.getOHEConfiguration(openHouseEvent);

    return this.renderListItem({
      onClickRoute: `${OHEConfig.action}/${openHouseEvent.id}`,
      key: openHouseEvent.id,
      iconName: 'dorbel_icon_calendar',
      itemText: `${openHouseEvent.timeLabel} | ${openHouseEvent.dateLabel} - ${openHouseEvent.dayLabel}` + '\'',
      isDisabled: OHEConfig.isDisabled,
      callToActionText: OHEConfig.callToActionText,
      callToActionTextClass: OHEConfig.callToActionTextClass
    });
  }

  getOHEConfiguration(openHouseEvent) {
    const oheConfig = {
      isDisabled: false,
      callToActionText: 'הרשמו לביקור',
      action: 'ohe-register'
    };

    switch (openHouseEvent.status) {
      case 'open':
        oheConfig.callToActionTextClass = 'ohe-list-open-action-text';
        break;
      case 'expired':
        oheConfig.isDisabled = true;
        oheConfig.callToActionText = 'מועד זה עבר';
        oheConfig.action = '';
        break;
      case 'full':
        oheConfig.isDisabled = true;
        oheConfig.action = '';
        oheConfig.callToActionText = 'לא נותרו מקומות פנויים לארוע זה';
        break;
      case 'registered':
        oheConfig.action = 'ohe-unregister';
        oheConfig.callToActionText = 'נרשמתם לארוע זה. לחצו לביטול';
        break;
      case 'late':
        oheConfig.isDisabled = true;
        oheConfig.action = '';
        oheConfig.callToActionText = 'האירוע קרוב מדי';
        break;
    }

    return oheConfig;
  }

  renderFollowItem(listing) {
    const { router } = this.props;
    let onClickFunction = () => {
      const currentRoute = router.getRoute().join('/');
      router.setRoute(`/${currentRoute}/${action}`);
    };

    let action = 'follow';
    let callToActionText = 'קבלו עדכונים על מועדים עתידיים';
    const userIsFollowing = this.props.appStore.oheStore.usersFollowsByListingId.get(listing.id);

    if (userIsFollowing) {
      action = 'unfollow';
      callToActionText = 'לחצו להסרה מרשימת העדכונים';
    }

    return <span className="follow-action" onClick={onClickFunction}>
      {callToActionText}
    </span>;
  }

  filterOHEsToDisplay(ohes) {
    const lastExpiredIndex = _.findLastIndex(ohes, { status: 'expired' });
    return lastExpiredIndex > -1 ? ohes.slice(lastExpiredIndex) : ohes;
  }

  render() {
    const { listing, router, oheId, appStore } = this.props;
    const openHouseEvents = this.filterOHEsToDisplay(this.props.appStore.oheStore.oheByListingId(listing.id));
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + '/apartments/' + listing.id;
    const oheForModal = oheId ? appStore.oheStore.oheById.get(oheId) : null;
    const closeModal = () => router.setRoute('/apartments/' + listing.id);

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-12 pull-left-lg">
            <div className="apt-reserve-container">
              <div className="apt-box-container">
                <div className="row price-container">
                  <div className="price">{listing.monthly_rent}</div>
                  <div className="price-desc"> ₪ / לחודש</div>
                </div>
                <div className="row social-share-wrapper">
                  <div className="social-share-container text-center">
                    <span>שתפו את הדירה</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a className="fa fa-facebook-square" href={'https://www.facebook.com/sharer.php?u=' + currentUrl} target="_blank"></a>
                    <a className="padding email fa fa-envelope" href={'mailto:?subject=Great%20apartment%20from%20dorbel&amp;body=' + currentUrl}></a>
                    <a className="padding whatsapp fa fa-whatsapp" href="whatsapp://send" data-href={currentUrl} data-text=""></a>
                    <a className="fb-messenger-desktop" href={'https://www.facebook.com/dialog/send?app_id=1651579398444396&link=' + currentUrl + '&redirect_uri=' + currentUrl} target="_blank"><Icon iconName="dorbel-icon-social-fbmsg" /></a>
                    <a className="fb-messenger-mobile" href={'fb-messenger://share/?link=' + currentUrl + '&app_id=1651579398444396'}><Icon iconName="dorbel-icon-social-fbmsg" /></a>
                  </div>
                </div>
              </div>
              <div className="list-group apt-choose-date-container">
                <h5 className="text-center apt-choose-date-title">בחרו מועד לביקור</h5>
                {openHouseEvents.map(this.renderOpenHouseEvent)}
                <div href="#" className="list-group-item owner-container text-center">
                  {this.renderFollowItem(listing)}
                  <h5>
                    <span>{listing.publishing_user_type === 'landlord' ? 'בעל הנכס' : 'דייר יוצא'}</span>
                    <span>: {listing.publishing_user_first_name || 'אנונימי'}</span>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <OHERegisterModal ohe={oheForModal} onClose={closeModal} action={this.props.action} />
        <FollowListingModal listing={listing} onClose={closeModal} action={this.props.action} />
      </div>
    );
  }
}

OHEList.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  router: React.PropTypes.object,
  oheId: React.PropTypes.string,
  action: React.PropTypes.string
};

export default OHEList;
