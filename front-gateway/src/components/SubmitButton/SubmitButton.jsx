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
      this.setState({ isWorking: true });
      let retVal = this.props.onClick();
      if (retVal && retVal.then) {
        retVal.then(() => this.setState({ isWorking: false }));
        retVal.catch(() => this.setState({ isWorking: false }));
      }
      else {
        this.setState({ isWorking: false });
      }
    }
    else {
      this.setState({ isWorking: false });
    }
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
