import React, { Component } from 'react';
import _ from 'lodash';

import './FormInput.scss';

class FormInput extends Component {
  render() {
    const props = _.omit(this.props, ['label', 'invalidText', 'validations']);
    let inputElement;

    if (this.props.type === 'textarea') {
      delete props.type;
      inputElement = <textarea {...props} rows="3" />;
    } else {
      inputElement = <input {...props} />;
    }

    return (
      <div className="form-input-container">
        <label className="form-input-label">{this.props.label}</label>
        {this.props.required && <span className="required-symbol"> *</span>}
        {inputElement}
        {this.props.invalidText && <span className="input-field-invalid-text">{this.props.invalidText}</span>}
      </div>
    );
  }
}

FormInput.propTypes = {
  invalidText: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
};

export default FormInput;
