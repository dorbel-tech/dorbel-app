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
    this.state = { dateValue: moment().format() }; // today
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
      this.props.onChange(dateValue.substring(10,0)); 
    }
  }

  render() {
    return (
      <ReactBootstrapDatePicker
        value={this.state.dateValue} 
        showClearButton={false}
        monthLabels={monthLabels}
        dayLabels={weekdayLabels}
        dateFormat={dateFormat}
        // these are revered because of RTL so need to be set 
        previousButtonElement=">"
        nextButtonElement="<"
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}

DatePicker.propTypes = {
  onChange: React.PropTypes.func
};

export default DatePicker;




