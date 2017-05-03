'use strict';
import React, { Component } from 'react';
import ReactBootstrapDatePicker from 'react-bootstrap-date-picker';
import moment from 'moment';

const monthLabels = moment.months(); // moment locales are set in App.jsx
const weekdayLabels = moment.weekdaysMin();
const dateFormat = moment.localeData()._longDateFormat.L;

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateValue: this.props.value || moment().add(1, 'days').format(), // tommorrow
      name: this.props.name
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({dateValue: nextProps.value});
  }

  componentDidMount() {
    // informing of setting the default value
    this.handleChange(this.state.dateValue);
  }

  handleChange(dateValue) {
    // ReactBootstrapDatePicker will return date-time as STRING
    this.setState({ dateValue });
    if (this.props.onChange) {
      // We want just date as string
      this.props.onChange(dateValue.substring(10, 0));
    }
  }

  render() {
    return (
      <ReactBootstrapDatePicker
        customControl={
          // The readOnly attribute prevents mobile devices
          // from popping up the keyboard on input touch.
          <input readOnly className="react-bootstrap-date-picker-custom-control" />
        }
        value={this.state.dateValue}
        name={this.state.name}
        showClearButton={false}
        monthLabels={monthLabels}
        dayLabels={weekdayLabels}
        dateFormat={dateFormat}
        disabled={this.props.disabled}
        calendarPlacement={this.props.calendarPlacement}
        calendarContainer={this.props.calendarContainer}
        // These are reversed because of RTL
        previousButtonElement=">"
        nextButtonElement="<"
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}

DatePicker.propTypes = {
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  name: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  calendarPlacement: React.PropTypes.string,
  calendarContainer: React.PropTypes.object
};

export default DatePicker;




