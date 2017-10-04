'use strict';
import React from 'react';
import _ from 'lodash';

class FormInput extends React.Component {
  render() {
    const props = _.omit(this.props, ['label', 'invalidText']);

    return (
      <label className="form-input-label">
        {this.props.label}
        <textarea
          {...props}
          rows="3"
        />
        {this.props.invalidText && <span className="input-field-invalid-text">{this.props.invalidText}</span>}
      </label>
    );
  }
};

export default FormInput;
