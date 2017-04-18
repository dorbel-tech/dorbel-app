import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import autobind from 'react-autobind';

import OHERegisterModal from './OHERegisterModal';
import FollowListingModal from './FollowListingModal';

@inject('appStore', 'appProviders', 'router') @observer
class OHEList extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { oheForModal: null };
  }

  renderListItem(params) {
    const { router } = this.props;
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
        <div>
          <div className="ohe-list-calendar-icon-container">
            <i className="fa fa-calendar-o" aria-hidden="true"></i>
          </div>
          <div className="ohe-list-date-and-time-container">
            <span className={params.highlightTitle ? 'highlight' : ''}>{params.itemText}</span>
            <br />
            <span className="ohe-text">{params.itemSubText}</span>
          </div>
          <div className="ohe-list-item-text-container">
            <div className={'ohe-list-item-text ' + params.callToActionTextClass || ''}>{params.callToActionText}</div>
            <div className="ohe-list-item-extra-text">{params.extraText}</div>
          </div>
        </div>
      </a>
    );
  }

  renderOpenHouseEvent(openHouseEvent) {
    const OHEConfig = this.getOHEConfiguration(openHouseEvent);

    return this.renderListItem({
      onClickRoute: `${OHEConfig.action}/${openHouseEvent.id}`,
      key: openHouseEvent.id,
      itemText: `${openHouseEvent.dateLabel} - ${openHouseEvent.dayLabel}` + '\'',
      itemSubText: `${openHouseEvent.timeLabel}`,
      isDisabled: OHEConfig.isDisabled,
      callToActionText: OHEConfig.callToActionText,
      callToActionTextClass: OHEConfig.callToActionTextClass,
      extraText: OHEConfig.extraText
    });
  }

  getOHEConfiguration(openHouseEvent) {
    const oheConfig = {
      isDisabled: false
    };

    switch (openHouseEvent.status) {
      case 'open':
        oheConfig.action = 'ohe-register';
        oheConfig.callToActionText = 'הרשמו לביקור';
        oheConfig.callToActionTextClass = 'ohe-list-open-action-text';
        break;
      case 'expired':
        oheConfig.isDisabled = true;
        oheConfig.action = '';
        oheConfig.callToActionText = 'מועד זה עבר';
        break;
      case 'full':
        oheConfig.isDisabled = true;
        oheConfig.action = '';
        oheConfig.callToActionText = 'לא נותרו מקומות למועד זה';
        break;
      case 'registered':
        oheConfig.action = 'ohe-unregister';
        oheConfig.callToActionText = 'רשום לביקור';
        oheConfig.callToActionTextClass = 'ohe-list-registered-action-text';
        oheConfig.extraText = 'לחצו לביטול הרשמה';
        break;
      case 'late':
        oheConfig.isDisabled = true;
        oheConfig.action = '';
        oheConfig.callToActionText = 'המועד קרוב מדי';
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
    let callToActionText = 'עדכנו אותי על מועדי ביקור חדשים';

    if (listing.status === 'rented' || listing.status === 'unlisted') {
      callToActionText = 'עדכנו אותי כשהדירה תתפרסם להשכרה';
    }

    const userIsFollowing = this.props.appStore.oheStore.usersFollowsByListingId.get(listing.id);

    if (userIsFollowing) {
      action = 'unfollow';
      callToActionText = 'הסירו אותי מרשימת העדכונים';
    }

    return <span className="follow-action" onClick={onClickFunction}>
      {callToActionText}
    </span>;
  }

  filterOHEsToDisplay(ohes) {
    const lastExpiredIndex = _.findLastIndex(ohes, { status: 'expired' });
    return lastExpiredIndex > -1 ? ohes.slice(lastExpiredIndex) : ohes;
  }

  shouldFollowersCountBeVisible() {
    const { appStore, listing } = this.props;
    return appStore.listingStore.isListingPublisherOrAdmin(listing);
  }

  renderListingFollowersCount(listing) {
    let followersCount = this.props.appStore.oheStore.countFollowersByListingId.get(listing.id);

    if (this.shouldFollowersCountBeVisible()) {
      return <div className="listing-followers-count">{followersCount} נרשמו לעדכונים לדירה זו</div>;
    } else {
      return null;
    }
  }

  getListingNotification(listing) {
    switch(listing.status) {
      case 'pending':
        return <span>המודעה ממתינה לאישור.<br/>כאן יופיעו מועדי הביקור לנכס ברגע שהוא יתפרסם.</span>;
      case 'rented':
        return <span>הדירה מושכרת כרגע. <br/>הרשמו על מנת לקבל עידכון ברגע שהדירה תוצע להשכרה שוב.</span>;
      case 'unlisted':
        return <span>המודעה לא פעילה. <br/>לפרסום המודעה </a>הכנסו לחשבונכם<a href={'/dashboard/my-properties/' + listing.id}> ועדכנו את הסטטוס שלה.</span>;

      default:
        return null;
    }
  }

  renderOheList(ohes, closeModal) {
    const { listing, oheId, appStore } = this.props;

    // Display list of OHEs only in case property is listed.
    if (listing.status === 'listed') {
      const openHouseEvents = this.filterOHEsToDisplay(ohes);
      const oheForModal = oheId ? appStore.oheStore.oheById.get(oheId) : null;

      return (
        <div>
          <div className="ohe-list">{openHouseEvents.map(this.renderOpenHouseEvent)}</div>
          <OHERegisterModal ohe={oheForModal} onClose={closeModal} action={this.props.action} />
        </div>
      );
    }
  }

  renderTitle(listing, ohes) {
    return (listing.status === 'listed' && ohes.length > 0) ?
      (
        <h5 className="listing-choose-date-title">
          בחרו מועד לביקור
        </h5>
      )
      : null;
  }

  render() {
    const { listing, router } = this.props;
    const closeModal = () => router.setRoute('/apartments/' + listing.id);
    const ohes = this.props.appStore.oheStore.oheByListingId(listing.id);

    return (
      <div className="list-group listing-choose-date-container">
        {this.renderTitle(listing, ohes)}
        {this.renderOheList(ohes, closeModal)}
        <div href="#" className="ohe-list-follow-container">
          <div className="listing-rented-notification">{this.getListingNotification(listing)}</div>
          {this.renderFollowItem(listing)}
          {this.renderListingFollowersCount(listing)}
        </div>
        <FollowListingModal listing={listing} onClose={closeModal} action={this.props.action} />
      </div >
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
