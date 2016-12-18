import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Icon from '../Icon/Icon';
import moment from 'moment';
import _ from 'lodash';

const timeFormat = 'HH:mm';
const dateFormat = 'DD/MM/YY';

@observer(['appStore', 'appProviders'])
class OHEList extends Component {
  constructor(props) {
    super(props);
    this.renderOpenHouseEvent = this.renderOpenHouseEvent.bind(this);
  }

  componentDidMount() {
    this.props.appProviders.oheProvider.loadListingEvents(this.props.listing.id);
  }

  renderOpenHouseEvent(openHouseEvent, index) {
    const start = moment(openHouseEvent.start_time);
    const end = moment(openHouseEvent.end_time);

    const timeLabel = `${start.format(timeFormat)} - ${end.format(timeFormat)}`;
    const dateLabel = start.format(dateFormat);

    let onClickFunction = () => this.props.appProviders.authProvider.showLoginModal();
    let callToActionText = 'לחץ לאישור הגעה במועד זה';
    if (this.props.appStore.authStore.isLoggedIn) {
      const user = this.props.appStore.authStore.getProfile();
      const usersOwnRegistration = _.find(openHouseEvent.registrations, { registered_user_id: user.dorbel_user_id });
      if (usersOwnRegistration) {
        onClickFunction = () => this.props.appProviders.oheProvider.unregisterForEvent(usersOwnRegistration);
        callToActionText = 'הינך רשומ/ה לארוע זה. לחצ/י לביטול';
      } else {
        onClickFunction = () => this.props.appProviders.oheProvider.registerForEvent(openHouseEvent);
      }
    }

    return (
      <a key={index} href="#" className="list-group-item" data-toggle="modal" data-target="#modal-signup" onClick={onClickFunction}>
        <div className="row">
          <div className="dorbel-icon-calendar pull-right">
            <Icon iconName="dorbel_icon_calendar" />
          </div>
          <div className="date-and-time pull-right">
            <span className="time">{timeLabel}</span>&nbsp;|&nbsp;
            <span className="date">{dateLabel}</span>
            <br className="visible-lg" />
            <i className="hidden-lg">&nbsp;</i>
            <span className="hidden-xs">{callToActionText}</span>
          </div>
          <div className="dorbel-icon-arrow fa fa-chevron-left pull-left"></div>
        </div>
    </a>
    );
  }

  render() {
    const { listing } = this.props;
    const openHouseEvents = this.props.appStore.oheStore.oheByListingId.get(this.props.listing.id) || [];    
    const currentUrl = 'https://app.dorbel.com/apartments/' + listing.id;

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
                <div href="#" className="list-group-item owner-container text-center">                 
                  <h5>
                  <span>{ listing.publishing_user_type === 'landlord' ? 'בעל הנכס' : 'דייר יוצא' }</span>
                  <span>: { listing.publishing_username || 'אנונימי' }</span>
                  </h5>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

OHEList.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object
};

export default OHEList;
