import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import './UploadApartmentForm.scss';

const steps = [
  'UploadApartmentStep1',
  'UploadApartmentStep2',
  'UploadApartmentStep3'
].map(stepName => require('./' + stepName).default);

@observer(['appStore', 'appProviders'])
class UploadApartmentForm extends Component {
  static hideFooter = true;

  constructor(props){
    super(props);
    this.state = {};
  }

  @action
  nextStep() {
    let { newListingStore } = this.props.appStore;

    if (newListingStore.stepNumber === steps.length - 1) { // last step
      let listing = this.mapUploadApartmentFormToCreateListing(newListingStore.formValues);
      this.props.appProviders.apartmentsProvider.uploadApartment(listing)
        .then((uploadApartmentResp) => { this.setState({ showSuccessModal: true, createdListingId: uploadApartmentResp.id }); })
        .catch((err) => this.props.appProviders.notificationProvider.error(err));
    } else {
      newListingStore.stepNumber++;
    }
  }

  @action
  prevStep() {
    let { newListingStore } = this.props.appStore;
    newListingStore.stepNumber--;
  }

  mapUploadApartmentFormToCreateListing(formValues) {
    let listing = {};
    // this is so we can use nested structure in our form attributes
    Object.keys(formValues).filter(key => formValues.hasOwnProperty(key)).forEach(key => _.set(listing, key, formValues[key]));
    listing.images = formValues.images.map((cloudinaryImage, index) => ({
      url: cloudinaryImage.secure_url, display_order: index
    }));

    return listing;
  }

  scrollToFirstError(formsy) {
    formsy.submit(); // will trigger validation messages

    // Find first invalid input and scroll to it
    const input = _.find(formsy.inputs, (input) => {
      return !input.isValid();
    });
    input.element.focus();
  }

  render() {
    const showSuccessModal = this.state.showSuccessModal;
    const createdListingId = this.state.createdListingId;
    const activeStep = {
      step: steps[this.props.appStore.newListingStore.stepNumber]
    };
    return <activeStep.step showSuccessModal={showSuccessModal} onClickNext={this.nextStep.bind(this)}
      onClickBack={this.prevStep.bind(this)} onValidationError={this.scrollToFirstError.bind(this)} createdListingId={createdListingId}/>;
  }
}

UploadApartmentForm.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object
};

export default UploadApartmentForm;
