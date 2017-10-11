import { Component } from 'react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';

@inject('appStore', 'appProviders') @observer
class UploadApartmentBaseStep extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = { formValues: {} };
    
    // TODO: refactor 
    // These lines were here because when removed, back functionality doesn't work on step2 for some reason - 
    // Should be checked when refactoring 
    this.handleChanges = this.handleChanges.bind(this);
    this.clickNext = this.clickNext.bind(this);
    this.clickBack = this.clickBack.bind(this);
  }

  clickNext() {
    if (this.props.onClickNext) {
      return this.props.onClickNext();
    }
  }

  clickBack() {
    if (this.props.onClickBack) {
      this.props.onClickBack();
    }
  }

  handleChange(key, value) {
    this.handleChanges({ [key] : value });
  }

  @action
  handleChanges(changes) {
    this.props.appStore.newListingStore.updateFormValues(changes);
  }
}

UploadApartmentBaseStep.wrappedComponent.propTypes = {
  onClickNext: PropTypes.func,
  onClickBack: PropTypes.func,
  appStore: PropTypes.object
};

export default UploadApartmentBaseStep;
