import React, { Component } from 'react';
import SummaryBox from '../SummaryBox';

class TotalIncomeBox extends Component {
  render() {
    const { totalIncomeFormatted } = this.props.leaseStatsVM;
    return (
      <SummaryBox
        value={totalIncomeFormatted}
        text={
          <div>
            הכנסה שנתית
          </div>
        }
      />
    );
  }
}

TotalIncomeBox.propTypes = {
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default TotalIncomeBox;

