import React, { Component } from 'react';
import formHelper from './formHelper';

class UploadApartmentBaseStep extends Component {
  constructor(props) {
    super(props);
    this.state = { formValues: {} };
  }

  clickNext() {
    if (this.props.onClickNext) {
      this.props.onClickNext(this.getFormValues());
    }
  }

  clickBack() {
    if (this.props.onClickBack) {
      this.props.onClickBack(this.getFormValues());
    }
  }

  handleChange(key, value) {
    // Non standard inputs (like DatePicker) are handled through state and not through refs
    this.setState({ formValues: Object.assign(this.state.formValues, { [key] : value })});
  }

  getFormValues() {
    return Object.assign(
      formHelper.getValuesFromInputRefs(this.refs), // raw inputs
      this.state.formValues // component inputs
    );
  }
}

UploadApartmentBaseStep.propTypes = {
  onClickNext: React.PropTypes.func,
  onClickBack: React.PropTypes.func
};

export default UploadApartmentBaseStep;
