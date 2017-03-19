import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Row } from 'react-bootstrap';
import autobind from 'react-autobind';
import Icon from '~/components/Icon/Icon';

import OHERegisterModal from './OHERegisterModal';
import FollowListingModal from './FollowListingModal';

@observer(['appStore', 'appProviders', 'router'])
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
        <Row>
          <div className="dorbel-icon-calendar pull-right">
            <Icon iconName={params.iconName} />
          </div>
          <div className="date-and-time pull-right">
            <span className={params.highlightTitle ? 'highlight' : ''}>{params.itemText}</span>
            <br />
            <span className="ohe-text">{params.itemSubText}</span>
          </div>
          <span className="ohe-list-item-text">{params.callToActionText}</span>
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
      itemText: `${openHouseEvent.dateLabel} - ${openHouseEvent.dayLabel}` + '\'',
      itemSubText: `${openHouseEvent.timeLabel}`,
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
      return <div className="listing-followers-count">{followersCount} אנשים נרשמו לעדכונים לדירה זו</div>;
    } else {
      return null;
    }
  }

  render() {
    const { listing, router, oheId, appStore } = this.props;
    const openHouseEvents = this.filterOHEsToDisplay(this.props.appStore.oheStore.oheByListingId(listing.id));
    const oheForModal = oheId ? appStore.oheStore.oheById.get(oheId) : null;
    const closeModal = () => router.setRoute('/apartments/' + listing.id);
    const oheSectionTitle = (listing.status === 'listed') ? 'בחרו מועד לביקור' : 'מועדי ביקור';
    const listingRentedNotification = (listing.status !== 'listed') ?
            <div className="listing-rented-notification">הדירה מושכרת כרגע. <br/>הרשמו על מנת לקבל עידכון ברגע שהדירה תוצע להשכרה שוב.</div> :
            null;
    return (
      <div className="list-group listing-choose-date-container">
        <h5 className="text-center listing-choose-date-title">{oheSectionTitle}</h5>
        <div className="ohe-list">{openHouseEvents.map(this.renderOpenHouseEvent)}</div>
        <div href="#" className="ohe-list-follow-container">
          {listingRentedNotification}
          {this.renderFollowItem(listing)}
          {this.renderListingFollowersCount(listing)}
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
