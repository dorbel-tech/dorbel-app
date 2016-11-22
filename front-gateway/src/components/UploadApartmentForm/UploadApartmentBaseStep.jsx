import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

@observer(['appStore', 'appProviders'])
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
      this.props.onClickNext();
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
    this.props.appStore.newListingStore.formValues = Object.assign(this.props.appStore.newListingStore.formValues, changes);    
  }
}

UploadApartmentBaseStep.wrappedComponent.propTypes = {
  onClickNext: React.PropTypes.func,
  onClickBack: React.PropTypes.func,
  appStore: React.PropTypes.object
};

export default UploadApartmentBaseStep;
