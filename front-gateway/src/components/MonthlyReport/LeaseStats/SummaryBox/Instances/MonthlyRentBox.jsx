import React, { Component } from 'react';
import SummaryBox from '../SummaryBox';

class MonthlyRentBox extends Component {
  render() {
    const { monthlyRentFormatted } = this.props.leaseStatsVM;
    return (
      <SummaryBox
        value={<div className="green">{monthlyRentFormatted}</div>}
        text='שכ"ד חודשי'
      />
    );
  }
}

MonthlyRentBox.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default MonthlyRentBox;

