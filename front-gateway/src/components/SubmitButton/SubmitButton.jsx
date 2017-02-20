import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import _ from 'lodash';

class SubmitButton extends Component {
  constructor(props) {
    super(props);
    this.state = { isWorking: false };
  }

  handleClick(e) {
    e.preventDefault();
    if (!this.state.isWorking) {
      this.setIsWorking(true);
      let retVal = this.props.onClick();
      if (retVal && retVal.then) {
        retVal.then(() => this.setIsWorking(false));
        retVal.catch(() => this.setIsWorking(false));
      } else {
        this.setIsWorking(false);
      }
    } else {
      this.setIsWorking(false);
    }
  }

  setIsWorking(isWorking) {
    this.setState({ isWorking });
  }

  render() {
    // Remove this component's PropTypes to prevent 'Unknown prop' warning
    const cleanProps = _.pickBy(this.props, (value, key) => !SubmitButton.propTypes[key]);

    return (
      <Button {...cleanProps} disabled={this.state.isWorking} onClick={this.handleClick.bind(this)} />
    );
  }
}

SubmitButton.propTypes = {
  onClick: React.PropTypes.func
};

export default SubmitButton;
