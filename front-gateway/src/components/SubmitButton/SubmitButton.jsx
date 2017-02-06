import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import _ from 'lodash';

let isWorking = false;

class SubmitButton extends Component {

  handleClick(e) {
    e.preventDefault();
    if (!isWorking) {
      isWorking = true;
      this.props.onClickPromise()
        .then(() => {
          isWorking = false;
        })
        .catch(() => {
          isWorking = false;
        });
    }
  }

  render() {
    // Remove this component's PropTypes to prevent 'Unknown prop' warning
    const cleanProps = _.pickBy(this.props, (value, key) => !SubmitButton.propTypes[key]);

    return (
      <Button {...cleanProps} onClick={this.handleClick.bind(this)} />
    );
  }
}

SubmitButton.propTypes = {
  onClickPromise: React.PropTypes.func
};

export default SubmitButton;
