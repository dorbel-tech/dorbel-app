'use strict';
import React from 'react';
import _ from 'lodash';

class FormInput extends React.Component {
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
      <label className="form-input-label">
        {this.props.label}
        {inputElement}
        {this.props.invalidText && <span className="input-field-invalid-text">{this.props.invalidText}</span>}
      </label>
    );
  }
}

FormInput.propTypes = {
  invalidText: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
};

export default FormInput;
