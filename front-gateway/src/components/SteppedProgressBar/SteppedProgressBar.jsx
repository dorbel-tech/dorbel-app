import React, { Component } from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';

import './SteppedProgressBar.scss';

class SteppedProgressBar extends Component {
  renderSteps() {
    const { steps, currentStepIndex } = this.props;

    return steps.map((step, stepIndex) => {
      let stepClasses = 'step ';
      if (stepIndex > currentStepIndex) {
        stepClasses += 'incomplete ';
      }
      else if (stepIndex < currentStepIndex) {
        stepClasses += 'complete';
      }
      else {
        stepClasses += 'current';
      }

      return <ProgressBar now={100 / steps.length} key={stepIndex} className={stepClasses} />;
    });
  }

  renderStepMarks() {
    const { steps } = this.props;
    return steps.map((step) => {
      return (
        <div className="step-mark-item" style={{ width: 100 / steps.length + '%' }}>
          <span>
            {step}
          </span>
        </div>
      );
    });
  }


  render() {
    return (
      <Row className="stepped-progress-bar">
        <Col xs={12}>
          <Row>
            <Col>
              <ProgressBar>
                {this.renderSteps()}
              </ProgressBar>
            </Col>
          </Row>
          <Row>
            <Col className="step-marks">
              {this.renderStepMarks()}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

SteppedProgressBar.propTypes = {
  steps: React.PropTypes.array.isRequired,
  currentStepIndex: React.PropTypes.number.isRequired
};

export default SteppedProgressBar;
