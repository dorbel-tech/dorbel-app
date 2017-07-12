import React, { Component } from 'react';
import SummaryBox from '../SummaryBox';

class MonthlyRentBox extends Component {
  render() {
    const { rentPayed } = this.props.leaseStatsVM;
    return (
      <SummaryBox
        value={rentPayed}
        text='עד כה שולם'
      />
    );
  }
}

MonthlyRentBox.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default MonthlyRentBox;

