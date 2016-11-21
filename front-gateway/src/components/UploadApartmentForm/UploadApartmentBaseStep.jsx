import React, { Component } from 'react';

class UploadApartmentBaseStep extends Component {
  constructor(props) {
    super(props);
    this.state = { formValues: {} };
    this.handleChanges = this.handleChanges.bind(this);
    this.clickNext = this.clickNext.bind(this);
    this.clickBack = this.clickBack.bind(this);
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
    this.handleChanges({ [key] : value });
  }

  handleChanges(changes) {
    this.setState({ formValues: Object.assign(this.state.formValues, changes)});
  }

  getFormValues() {
    return this.state.formValues;
  }
}

UploadApartmentBaseStep.propTypes = {
  onClickNext: React.PropTypes.func,
  onClickBack: React.PropTypes.func
};

export default UploadApartmentBaseStep;
