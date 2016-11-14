import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './UploadApartmentForm.scss';

const steps = [
  'UploadApartmentStep1',
  'UploadApartmentStep2',
  'UploadApartmentStep3'
].map(stepName => require('./' + stepName).default);

@observer(['appStore', 'appProviders', 'router'])
class UploadApartmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = { stepNumber: 0, formValues: {} };
  }

  nextStep(formValues) {
    this.setState({ formValues: Object.assign(this.state.formValues, formValues) });
    
    if (this.state.stepNumber === steps.length - 1) {
      // last step
      this.props.appProviders.apartmentsProvider.uploadApartment(this.state.formValues)
      .then(() => this.props.router.setRoute('/apartments'))
      .catch(() => alert('upload failed'));
    } else {
      this.setState({ stepNumber: this.state.stepNumber + 1 });
    }
  }

  render() {
    const activeStep = {
      step: steps[this.state.stepNumber]
    };
    return <activeStep.step onClickNext={this.nextStep.bind(this)} />;
  }

  static hideApplicationHeader = true
}

UploadApartmentForm.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  router: React.PropTypes.object
};

export default UploadApartmentForm;
