import React, { Component } from 'react';
import Icon from '../Icon/Icon';
import moment from 'moment';

const eventsMock = [
  { start_time: new Date(2016, 11, 1, 16, 0), end_time: new Date(2016, 11, 1, 17, 0) },
  { start_time: new Date(2016, 11, 3, 7, 0), end_time: new Date(2016, 11, 3, 7, 30) }
]; 

const timeFormat = 'HH:mm';
const dateFormat = 'DD/MM/YY';

class OHEList extends Component {
  renderEvent(event, index) {
    const start = moment(event.start_time);
    const end = moment(event.end_time);

    const timeLabel = `${start.format(timeFormat)} - ${end.format(timeFormat)}`;
    const dateLabel = start.format(dateFormat);

    return (
      <a key={index} href="#" className="list-group-item" data-toggle="modal" data-target="#modal-signup">
        <div className="row">
          <div className="dorbel-icon-calendar pull-right">
            <Icon iconName="dorbel_icon_calendar" />
          </div>
          <div className="date-and-time pull-right">
            <span className="time">{timeLabel}</span>&nbsp;|&nbsp;
            <span className="date">{dateLabel}</span>
            <br className="visible-lg" />
            <i className="hidden-lg">&nbsp;</i>
            <span className="hidden-xs">לחץ לאישור הגעה במועד זה</span>
          </div>
          <div className="dorbel-icon-arrow fa fa-chevron-left pull-left"></div>
        </div>
    </a>
    );
  }

  render() {
    const { listing } = this.props;
    const events = eventsMock;

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
                    <span>שתפו את הדירה</span>&nbsp;
                    <a className="fa fa-facebook-square" href="https://www.facebook.com/sharer.php?u=https://app.dorbel.com/apartments/435-hotels-combined" target="_blank"></a>&nbsp;
                    <a className="fa fa-envelope" href="mailto:?subject=Great%20apartment%20from%20dorbel&amp;body=https://app.dorbel.com/apartments/435-hotels-combined"></a>&nbsp;
                    <a href=""><Icon iconName="dorbel-icon-social-fbmsg" /></a>
                  </div>
                </div>
                <div className="chupchik visible-lg"></div>
              </div>

              <div className="list-group apt-choose-date-container">
                <h5 className="text-center apt-choose-date-title">בחר במועד לביקור</h5>
                {events.map(this.renderEvent)}
                <a href="#" className="list-group-item owner-container text-center">
                  <div>
                    <img src="https://github.com/dorbel-tech/dorbel-design-v2/raw/master/assets/images/owner.png" alt="" className="img-circle" />
                  </div>
                  <h5>בעלת הנכס: ענת</h5>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

OHEList.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default OHEList;
