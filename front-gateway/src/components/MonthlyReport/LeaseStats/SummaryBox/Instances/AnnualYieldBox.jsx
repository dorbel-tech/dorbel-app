import React, { Component } from 'react';
import SummaryBox from '../SummaryBox';

class AnnualYieldBox extends Component {
  render() {
    const { annualYield } = this.props.leaseStatsVM;
    return (
      <SummaryBox
        value={annualYield}
        text={
          <div>
            תשואה שנתית צפויה
          </div>
        } />
    );
  }
}

AnnualYieldBox.propTypes = {
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default AnnualYieldBox;
