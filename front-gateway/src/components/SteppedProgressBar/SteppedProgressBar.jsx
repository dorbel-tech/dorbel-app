import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap';

import './SteppedProgressBar.scss';

class SteppedProgressBar extends Component {
  renderSteps(steps, currentStepIndex, stepWidth) {

    return steps.map((step, index) => {
      let stepClasses = 'step ';
      if (index < currentStepIndex) {
        stepClasses += 'complete';
      }
      else if (index == currentStepIndex) {
        stepClasses += 'current';
      }

      return (
        <ProgressBar now={stepWidth} key={index} className={stepClasses} />
      );
    });
  }

  renderStepMarks(steps, currentStepIndex, stepWidth) {
    return steps.map((step, index) => {
      const stepMarkClasses = (index != currentStepIndex) ? 'step-mark-item' : 'step-mark-item current';

      return (
        <div className={stepMarkClasses} key={index} style={{ width: stepWidth + '%' }}>
          <span>
            {step}
          </span>
        </div>
      );
    });
  }

  calculateIndicatorOffset(currentStepIndex, stepWidth) {
    return ((stepWidth * currentStepIndex) + (stepWidth / 2)) - 12.5;
  }

  render() {
    const { steps, currentStepIndex, pointerText, hideStepMarks } = this.props;
    const stepWidth = 100 / steps.length;
    return (
      <Grid fluid className="stepped-progress-bar">
        <Row>
          <Col xs={12}>
            {
              pointerText ?
                <Row>
                  <Col className="current-step-pointer" style={{ marginLeft: this.calculateIndicatorOffset(currentStepIndex, stepWidth) + '%' }}>
                    <span className="current-step-pointer-text">{pointerText}</span>
                  </Col>
                </Row> : undefined
            }
            <Row className="progress-bar-row">
              <Col>
                <ProgressBar>
                  {this.renderSteps(steps, currentStepIndex, stepWidth)}
                </ProgressBar>
              </Col>
            </Row>
            {
              hideStepMarks ?
                undefined :
                <Row>
                  <Col className="step-marks">
                    {this.renderStepMarks(steps, currentStepIndex, stepWidth)}
                  </Col>
                </Row>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

SteppedProgressBar.propTypes = {
  steps: PropTypes.array.isRequired,
  currentStepIndex: PropTypes.number.isRequired,
  pointerText: PropTypes.string,
  hideStepMarks: PropTypes.bool
};

export default SteppedProgressBar;
