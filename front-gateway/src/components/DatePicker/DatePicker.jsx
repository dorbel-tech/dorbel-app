'use strict';
import React, { Component } from 'react';
import ReactBootstrapDatePicker from 'react-bootstrap-date-picker';
import { FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';

const monthLabels = moment.months(); // moment locales are set in App.jsx
const weekdayLabels = moment.weekdaysMin();
const dateFormat = moment.localeData()._longDateFormat.L;

class CustomControl extends Component {
  static propTypes = {
    onClear: React.PropTypes.func,
    showClearButton: React.PropTypes.bool
  }

  clear() {
    this.props.onClear && this.props.onClear();
  }

  render() {
    const restOfProps = _.omit(this.props, ['showClearButton', 'onClear']);
    const inputProps = {
      // The readOnly attribute prevents mobile devices
      // from popping up the keyboard on input touch.
      readOnly: true,
      className: 'react-bootstrap-date-picker-custom-control',
      ...restOfProps
    };

    if (this.props.showClearButton) {
      return (<InputGroup>
        <FormControl {...inputProps} />
        <InputGroup.Addon><Glyphicon glyph="remove" onClick={this.clear.bind(this)}/></InputGroup.Addon>
      </InputGroup>);
    } else {
      return <input {...inputProps} />;
    }
  }
}

class DatePicker extends Component {
  constructor(props) {
    super(props);

    let defaultDateValue = this.props.value;

    if (!this.props.placeholder && !this.props.value) {
      defaultDateValue = moment().add(1, 'days').format(); // default to tommorrow
    }

    this.state = {
      dateValue: defaultDateValue,
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
      this.props.onChange(dateValue && dateValue.substring(10, 0));
    }
  }

  clear() {
    this.handleChange(undefined);
  }

  render() {
    return (
      <ReactBootstrapDatePicker
        customControl={<CustomControl showClearButton={!!this.props.showClearButton} onClear={this.clear.bind(this)} />}
        value={this.state.dateValue}
        name={this.state.name}
        monthLabels={monthLabels}
        dayLabels={weekdayLabels}
        dateFormat={dateFormat}
        disabled={this.props.disabled}
        calendarPlacement={this.props.calendarPlacement}
        calendarContainer={this.props.calendarContainer}
        placeholder={this.props.placeholder}
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
  calendarContainer: React.PropTypes.object,
  placeholder: React.PropTypes.string,
  showClearButton: React.PropTypes.bool,
  onClear: React.PropTypes.func
};

export default DatePicker;
