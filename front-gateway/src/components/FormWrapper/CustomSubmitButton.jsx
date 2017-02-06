import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

let isWorking = false;
class CustomSubmitButton extends Component {

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
    else {
      console.log('detected double click');
    }
  }

  render() {
    let { onClickPromise, ...rest } = this.props;
    return (
      <Button {... rest} onClick={this.handleClick.bind(this)} />
    );
  }
}

CustomSubmitButton.propTypes = {
  onClickPromise: React.PropTypes.func
};

export default CustomSubmitButton;
