import React, { Component } from 'react';
import SummaryBox from '../SummaryBox';

class TotalYieldBox extends Component {
  render() {
    const { totalYield } = this.props.leaseStatsVM;
    return (
      <SummaryBox
        value={totalYield}
        text={
          <div>
            תשואה שנתית
          </div>
        } />
    );
  }
}

TotalYieldBox.propTypes = {
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default TotalYieldBox;
