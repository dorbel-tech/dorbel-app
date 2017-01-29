import React from 'react';
import { FRC } from '~/components/FormWrapper/FormWrapper';
import { Row, Col } from 'react-bootstrap';
import autobind from 'react-autobind';
import DatePicker from '~/components/DatePicker/DatePicker';
import moment from 'moment';
import utils from '../../providers/utils';
import './AddOHEInput.scss';

const hours = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
];

class AddOHEInput extends React.Component {
  constructor(props) {
    super(props);

    if (props.ohe) {
      this.state = {
        start_time: utils.formatTime(props.ohe.start_time),
        end_time: utils.formatTime(props.ohe.end_time),
        date: props.ohe.start_time,
        max_attendies: props.ohe.max_attendies
      };
    } else {
      this.state = {
        start_time: hours[24],
        end_time: hours[25],
        max_attendies: 15,
        error: undefined
      };
    }

    autobind(this);
  }

  getHourOptions(hoursArray) {
    return hoursArray.map((hour) => ({ label: hour }));
  }

  getStartHours() {
    return hours.slice(0, -1);
  }

  getEndHours() {
    return hours.slice(hours.indexOf(this.state.start_time) + 1);
  }

  timeChange(timeField, value) {
    const newState = Object.assign({}, this.state, { [timeField]: value });
    if (hours.indexOf(newState.start_time) >= hours.indexOf(newState.end_time)) {
      newState.end_time = hours[hours.indexOf(newState.start_time) + 1];
    }

    this.setState(newState, this.validate);
  }
  dateChange(value) {
    this.setState({ date: value }, this.validate);
  }

  validate() {
    const now = moment();
    const selectedTime = moment(new Date(this.state.date + ' ' + this.state.start_time));
    let error;
    if (now > selectedTime) {
      error = 'לא ניתן לקבוע ביקור במועד שחלף';
    } else if (now >= selectedTime.add(-90, 'm')) {
      error = 'מועד הביקור קרוב מדי';
    }

    this.setState({ error: error }, this.fireChange);

  }

  maxAttendiesChange(attendiesField, value) {
    this.setState({ max_attendies: parseInt(value) }, this.validate);
  }

  fireChange() {
    this.props.onChange({
      start_time: this.setTimeFromString(this.state.date, this.state.start_time),
      end_time: this.setTimeFromString(this.state.date, this.state.end_time),
      max_attendies: this.state.max_attendies,
      error: this.state.error
    });
  }

  setTimeFromString(dateString, timeString) {
    return moment(dateString + 'T' + timeString).toISOString();
  }

  renderError() {
    return this.state.error ?
      <div>
        <span className="ohe-form-error">
          {this.state.error}
        </span>
      </div>
      :
      null;
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={12} className="form-group">
            <label>תאריך הביקור</label>
            <DatePicker name="ohe-date" onChange={this.dateChange} value={this.state.date} disabled={!!this.props.ohe} />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FRC.Select name="start_time"
              label="שעת התחלה"
              options={this.getHourOptions(this.getStartHours())}
              value={this.state.start_time}
              onChange={this.timeChange}
              />
          </Col>
          <Col md={6}>
            <FRC.Select name="end_time"
              label="שעת סיום"
              options={this.getHourOptions(this.getEndHours())}
              value={this.state.end_time}
              onChange={this.timeChange}
              />
          </Col>
        </Row>
        <Row>
          <Col md={12} className="form-group">
            <FRC.Input name="max_attendies"
              type="number"
              label="מקסימום נרשמים"
              value={this.state.max_attendies}
              min={1}
              onChange={this.maxAttendiesChange}
              required />
          </Col>
        </Row>
        {this.renderError()}
      </div>
    );
  }
}

AddOHEInput.propTypes = {
  onChange: React.PropTypes.func,
  ohe: React.PropTypes.object
};

export default AddOHEInput;
