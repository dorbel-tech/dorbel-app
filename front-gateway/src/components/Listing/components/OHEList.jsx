import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import autobind from 'react-autobind';
import OHERegisterModal from './OHERegisterModal';
import { getPropertyPath, getDashMyPropsPath } from '~/routesHelper';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ListingOwnerDetails from './ListingOwnerDetails';

@inject('appStore', 'appProviders', 'router') @observer
class OHEList extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { oheForModal: null };
  }

  componentDidMount() {
    const { appProviders, listing } = this.props;
    appProviders.oheProvider.loadListingEvents(listing.id);
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
      itemText: `יום ${openHouseEvent.dayLabel}׳, ${openHouseEvent.dateLabel}`,
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
        oheConfig.callToActionText = 'הרשם לביקור';
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
        oheConfig.callToActionText = 'בטל הרשמה';
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

  filterOHEsToDisplay(ohes) {
    const lastExpiredIndex = _.findLastIndex(ohes, { status: 'expired' });
    return lastExpiredIndex > -1 ? ohes.slice(lastExpiredIndex) : ohes;
  }

  getListingNotification(listing) {
    switch(listing.status) {
      case 'rented':
        return (
        <div className="ohe-list-notification-container">
          <div className="listing-rented-notification">
          <span>
            <h4>הדירה מושכרת כרגע</h4>
            <p>אהבתם את הדירה? רוצים לדעת לפני כולם כשהיא תתפנה שוב? לחצו על ׳<i className="fa fa-heart-o red-heart"></i> אהבתי׳ לשמירת הדירה ולקבלת עדכון כשהיא עומדת להתפנות.</p>
          </span>
          </div>
        </div>
        );
      case 'unlisted':
        return (
        <div className="ohe-list-notification-container">
          <div className="listing-rented-notification">
          <span>
            <h4>המודעה לא פעילה</h4>
            <p>לפרסום המודעה הכנסו <a href={getDashMyPropsPath(listing)}>לחשבונכם ועדכנו</a> את הסטטוס שלה.</p>
          </span>
          </div>
        </div>
        );
      default:
        return null;
    }
  }

  renderOheList(ohes, closeModal) {
    const { listing, oheId, appStore } = this.props;

    // Display list of OHEs only in case property is pending or listed.
    if (this.isListingPendingOrListied(listing)) {
      const openHouseEvents = this.filterOHEsToDisplay(ohes);
      const oheForModal = oheId ? appStore.oheStore.oheById.get(oheId) : null;

      return (
        <div>
          <div className="ohe-list">{openHouseEvents.filter((ohe) => ohe.status != 'inactive').map(this.renderOpenHouseEvent)}</div>
          <OHERegisterModal ohe={oheForModal} onClose={closeModal} action={this.props.action} />
          <div className="listing-ohe-box-text text-center">לא יכולים להגיע? אין מועדים זמינים?
לחצו על ׳<i className="fa fa-heart-o red-heart"></i> אהבתי׳ ושמרו את הדירה לקבלת עדכונים על מועדי ביקור חדשים.</div>
        </div>
      );
    }
  }

  isListingPendingOrListied(listing) {
    return (listing.status === 'pending' || listing.status === 'listed');
  }

  renderTitle(listing, ohes) {
    if (this.isListingPendingOrListied(listing) && ohes.length > 0) {
      return (
        <h5 className="listing-choose-ohe-title">
          בחרו מועד לביקור
        </h5>
      );
    } else if (this.isListingPendingOrListied(listing) && ohes.length === 0) {
      return (
        <h5 className="listing-choose-ohe-title">
           אין מועדי ביקור לדירה
        </h5>
      );
    }
  }

  renderLoading() {
    return (
      <div className="ohe-list-loading-container listing-choose-ohe-container">
        <LoadingSpinner />
      </div>
    );
  }

  render() {
    const { listing, router } = this.props;
    const closeModal = () => router.setRoute(getPropertyPath(listing));
    const ohes = this.props.appStore.oheStore.oheByListingId(listing.id);

    if (!ohes) {
      return this.renderLoading();
    }

    return (
      <div className="list-group listing-choose-ohe-container">
        <ListingOwnerDetails listing={listing} />
        {this.renderTitle(listing, ohes)}
        {this.renderOheList(ohes, closeModal)}
        {this.getListingNotification(listing)}
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
