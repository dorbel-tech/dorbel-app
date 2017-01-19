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
    const currentRoute = router.getRoute().join('/');
    let className = 'list-group-item';
    let onClickFunction = () => router.setRoute(`/${currentRoute}/${params.onClickRoute}`);

    if (params.isDisabled) {
      onClickFunction = null;
      className += ' disabled';
    }

    return (
      <a key={params.key} href="#" className={className} onClick={onClickFunction}>
        <Row>
          <div className="dorbel-icon-calendar pull-right">
            <Icon iconName={params.iconName} />
          </div>
          <div className="date-and-time pull-right">
            <span className={params.highlightTitle ? 'highlight' : ''}>{params.itemText}</span>
            <br className="visible-lg" />
            <i className="hidden-lg">&nbsp;</i>
            <span className="hidden-xs">{params.callToActionText}</span>
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
      itemText: `${openHouseEvent.timeLabel} | ${openHouseEvent.dateLabel}`,
      isDisabled: OHEConfig.isDisabled,
      callToActionText: OHEConfig.callToActionText
    });
  }

  getOHEConfiguration(openHouseEvent) {
    const oheConfig = {
      isDisabled: false,
      callToActionText: 'לחצו לאישור הגעה במועד זה',
      action: 'ohe-register'
    };

    switch (openHouseEvent.status) {
      case 'open':
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
        oheConfig.action = ''; // TODO: POPUP
        oheConfig.callToActionText = 'האירוע קרוב מדי (טקסט זמני)'; //TODO: get appropriate text
        break;
    }

    return oheConfig;
  }

  renderFollowItem(listing) {
    let action = 'follow';
    let itemText = 'אהבנו, אבל לא נצליח להגיע';
    let callToActionText = 'קבלו עדכונים על מועדים עתידיים';
    const userIsFollowing = this.props.appStore.oheStore.usersFollowsByListingId.get(listing.id);

    if (userIsFollowing) {
      action = 'unfollow';
      itemText = 'אתם עוקבים אחרי דירה זו';
      callToActionText = 'לחצו להסרה מרשימת העדכונים';
    }

    return this.renderListItem({
      itemText, callToActionText,
      iconName: 'icon-dorbel-icon-master_icon-calendar-plus',
      onClickRoute: action,
      highlightTitle: (action == 'follow')
    });
  }

  filterOHEsToDisplay(ohes) {
    const lastExpiredIndex = _.lastIndexOf(ohes, (item) => (item.status == 'expired'));
    return lastExpiredIndex ?
      ohes.slice(lastExpiredIndex-1) : ohes;
  }

  render() {
    const { listing, router, oheId, appStore } = this.props;
    const openHouseEvents = this.filterOHEsToDisplay(this.props.appStore.oheStore.oheByListingId(listing.id));
    const currentUrl = 'https://app.dorbel.com/apartments/' + listing.id;
    const oheForModal = oheId ? appStore.oheStore.oheById.get(oheId) : null;
    const closeModal = () => router.setRoute('/apartments/' + listing.id);

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-12 pull-left-lg">
            <div className="apt-reserve-container">              
              
              <div className="price-container">
                <div className="row">
                  <div className="price pull-right">{listing.monthly_rent}<span className="currency"> ₪</span></div>
                  <div className="price-desc pull-left">לחודש</div>
                </div>
                <div className="row social-share-wrapper">
                  <div className="social-share-container text-center">
                    <span>שתפו את הדירה</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a className="fa fa-facebook-square" href={'https://www.facebook.com/sharer.php?u=' + currentUrl} target="_blank"></a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a className="fa fa-envelope" href={'mailto:?subject=Great%20apartment%20from%20dorbel&amp;body=' + currentUrl}></a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href={'https://www.facebook.com/dialog/send?app_id=1651579398444396&link=' + currentUrl + '&redirect_uri=' + currentUrl}><Icon iconName="dorbel-icon-social-fbmsg" /></a>
                  </div>
                </div>
                <div className="chupchik visible-lg"></div>
              </div>

              <div className="list-group apt-choose-date-container">
                <h5 className="text-center apt-choose-date-title">בחר במועד לביקור</h5>
                {openHouseEvents.map(this.renderOpenHouseEvent)}
                {this.renderFollowItem(listing)}
                <div href="#" className="list-group-item owner-container text-center">                 
                  <h5>
                  <span>{ listing.publishing_user_type === 'landlord' ? 'בעל הנכס' : 'דייר יוצא' }</span>
                  <span>: { listing.publishing_user_first_name || 'אנונימי' }</span>
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
