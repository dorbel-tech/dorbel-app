import React, { Component } from 'react';
import SummaryBox from '../SummaryBox';

class RentPayedBox extends Component {
  render() {
    const { rentPayedFormatted } = this.props.leaseStatsVM;
    return (
      <SummaryBox
        value={rentPayedFormatted}
        text='עד כה שולם'
      />
    );
  }
}

RentPayedBox.propTypes = {
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default RentPayedBox;

