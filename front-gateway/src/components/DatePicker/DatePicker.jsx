'use strict';
import React, { Component } from 'react';
import ReactBootstrapDatePicker from 'react-bootstrap-date-picker';
import { FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';

const monthLabels = moment.months(); // moment locales are set in App.jsx
const weekdayLabels = moment.weekdaysMin();
const dateFormat = moment.localeData()._longDateFormat.L;

class InputWithClearButton extends Component {
  static propTypes = {
    onClear: React.PropTypes.func    
  }

  clear() {
    this.props.onClear && this.props.onClear();
  }

  render() {
    const inputProps = _.omit(this.props, ['onClear']);

    return (<InputGroup>
      <FormControl {...inputProps} readOnly className="react-bootstrap-date-picker-custom-control" />
      <InputGroup.Addon onClick={this.clear.bind(this)} ><Glyphicon glyph="remove"/></InputGroup.Addon>
    </InputGroup>);
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
    let customControl = <input readOnly className="react-bootstrap-date-picker-custom-control" />;    
    if (this.props.showClearButton) {
      customControl = <InputWithClearButton onClear={this.clear.bind(this)} />;
    }

    return (
      <ReactBootstrapDatePicker
        customControl={customControl}
        value={this.state.dateValue}
        name={this.state.name}
        monthLabels={monthLabels}
        dayLabels={weekdayLabels}
        dateFormat={dateFormat}
        disabled={this.props.disabled}
        calendarPlacement={this.props.calendarPlacement}
        calendarContainer={this.props.calendarContainer}
        placeholder={this.props.placeholder}
        showClearButton={false}
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
