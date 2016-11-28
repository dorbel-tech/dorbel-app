import React, { Component } from 'react';
import Icon from '../Icon/Icon';
import moment from 'moment';
import './OHEList.scss';

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
          <div className="dorbel-icon-calendar pull-left">
            <Icon iconName="icon_calendar" />
          </div>
            <div className="date-and-time pull-left">
                <span className="time">{timeLabel}</span>&nbsp;|&nbsp;
                <span className="date">{dateLabel}</span>
                <br className="visible-lg" />
                <i className="hidden-lg">&nbsp;</i>
                <span className="hidden-xs">לחץ לאישור הגעה במועד זה</span>
            </div>
            <div className="dorbel-icon-arrow fa fa-chevron-left pull-right"></div>
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
              <div className="dorbel-arrow-container visible-lg">
                <Icon iconName="dorbel_arrow" />
                <div className="arrow-cta">בחר במועד בו תרצה לבקר בנכס</div>
              </div>
              <div className="price-container">
                <div className="row">
                  <div className="price pull-left">{listing.monthly_rent}<span className="currency"> ₪</span></div>
                  <div className="price-desc pull-right">לחודש</div>
                </div>
                <div className="row">
                  <div className="fee pull-left">1550 <span className="currency">₪</span></div>
                  <div className="price-desc pull-right">עמלה חד פעמית</div>
                </div>
                <div className="chupchik visible-lg"></div>
              </div>
              <div className="list-group apt-choose-date-container">
                {events.map(this.renderEvent)}
                <a href="#" className="list-group-item owner-container text-center">
                  <div>
                    <i>i</i>
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
