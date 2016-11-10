import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './UploadApartmentForm.scss';

import UploadApartmentStep1 from './UploadApartmentStep1';
import UploadApartmentStep2 from './UploadApartmentStep2';

@observer(['appStore', 'appProviders'])
class UploadApartmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = { stepNumber: 0 };
  }

  nextStep() {
    this.setState(prevState => ({ stepNumber: prevState.stepNumber + 1 }));
  }

  render() {
    const steps = [
      <UploadApartmentStep1 onClickNext={this.nextStep.bind(this)} />,
      <UploadApartmentStep2 />
    ];

    return steps[this.state.stepNumber];
  }
}

export default UploadApartmentForm;
