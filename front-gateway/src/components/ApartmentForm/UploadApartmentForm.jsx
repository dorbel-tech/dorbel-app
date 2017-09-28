import React, { Component } from 'react';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import './UploadApartmentForm.scss';

const steps = [
  'UploadApartmentStep1',
  'UploadApartmentStep2',
  'UploadApartmentStep3'
].map(stepName => require('./' + stepName).default);

@inject('appStore', 'appProviders') @observer
class UploadApartmentForm extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);
    this.validateAndSetMode();
    this.state = {};
    props.appStore.metaData.title = 'dorbel - פרסמו דירה להשכרה תוך 2 דק׳';
  }

  validateAndSetMode() {
    const { newListingStore } = this.props.appStore;
    newListingStore.attemptRestoreState();

    if (process.env.IS_CLIENT) {
      this.props.appProviders.navProvider.setRoute('/properties/submit');
    }
  }

  nextStep() {
    let { newListingStore } = this.props.appStore;

    if (newListingStore.stepNumber === steps.length - 1) { // last
      let listing = newListingStore.toListingObject();
      return this.props.appProviders.listingsProvider.uploadApartment(listing)
        .then((uploadApartmentResp) => {
          this.setState({ showSuccessModal: true, createdListingId: uploadApartmentResp.id });
        })
        .catch((err) => {
          this.props.appProviders.notificationProvider.error(err);
        });
    }
    else {
      newListingStore.stepNumber++;
    }
  }

  @action
  prevStep() {
    let { newListingStore } = this.props.appStore;
    newListingStore.stepNumber--;
  }

  scrollToFirstError(formsy) {
    formsy.submit(); // will trigger validation messages

    // Find first invalid input and scroll to it
    const input = _.find(formsy.inputs, (input) => {
      return !input.isValid();
    });

    if (input.element) {
      input.element.focus();
    }
  }

  render() {
    const showSuccessModal = this.state.showSuccessModal;
    const createdListingId = this.state.createdListingId;
    const activeStep = {
      step: steps[this.props.appStore.newListingStore.stepNumber]
    };
    return <activeStep.step showSuccessModal={showSuccessModal} onClickNext={this.nextStep.bind(this)}
      onClickBack={this.prevStep.bind(this)} onValidationError={this.scrollToFirstError.bind(this)} createdListingId={createdListingId} />;
  }
}

UploadApartmentForm.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object
};

export default UploadApartmentForm;
