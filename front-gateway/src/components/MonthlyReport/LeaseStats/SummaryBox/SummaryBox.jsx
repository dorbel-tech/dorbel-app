import React, { Component } from 'react';

import './SummaryBox.scss';

class SummaryBox extends Component {

  renderLink() {
    const { linkText, linkOnClick } = this.props;
    if (linkText && linkOnClick) {
      return (
        <div className="summary-box-content-link" onClick={linkOnClick}>
          {linkText}
        </div>
      );
    }
  }

  render() {
    const { value, text } = this.props;
    return (
      <div className="summary-box">
        <div className="summary-box-content">
          <div className="summary-box-content-value">
            {value}
          </div>
          <div className="summary-box-content-text">
            {text}
          </div>
          {this.renderLink()}
        </div>
      </div>
    );
  }
}

SummaryBox.propTypes = {
  value: React.PropTypes.node,
  text: React.PropTypes.node,
  linkText: React.PropTypes.node,
  linkOnClick: React.PropTypes.func
};

export default SummaryBox;
