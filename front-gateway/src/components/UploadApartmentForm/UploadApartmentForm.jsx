import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import './UploadApartmentForm.scss';

const steps = [
  'UploadApartmentStep1',
  'UploadApartmentStep2',
  'UploadApartmentStep3'
].map(stepName => require('./' + stepName).default);

@observer(['appStore', 'appProviders'])
class UploadApartmentForm extends Component {
  static hideFooter = true;

  @action
  nextStep() {
    let { newListingStore } = this.props.appStore;
    if (newListingStore.stepNumber === steps.length - 1) { // last step
      this.props.appProviders.apartmentsProvider.uploadApartment(newListingStore.formValues)
        .then(() => this.setState({ showSuccessModal: true }))
        .catch(this.props.appProviders.notificationProvider.error);
    } else {
      newListingStore.stepNumber++;
    }
  }

  @action
  prevStep() {
    this.props.appStore.newListingStore.stepNumber--;
  }

  render() {
    const showSuccessModal = this.state && this.state.showSuccessModal;
    const activeStep = {
      step: steps[this.props.appStore.newListingStore.stepNumber]
    };
    return <activeStep.step showSuccessModal={showSuccessModal} onClickNext={this.nextStep.bind(this)} onClickBack={this.prevStep.bind(this)} />;
  }
}

UploadApartmentForm.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object
};

export default UploadApartmentForm;
