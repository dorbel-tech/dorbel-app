import React, { Component } from 'react';
import SummaryBox from '../SummaryBox';

class AnnualIncomeBox extends Component {
  render() {
    const { annualIncomeFormatted } = this.props.leaseStatsVM;
    return (
      <SummaryBox
        value={annualIncomeFormatted}
        text={
          <div>
            הכנסה שנתית צפויה
          </div>
        }
      />
    );
  }
}

AnnualIncomeBox.propTypes = {
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default AnnualIncomeBox;

