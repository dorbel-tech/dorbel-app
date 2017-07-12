import React, { Component } from 'react';
import SummaryBox from '../SummaryBox';

class RentPayedBox extends Component {
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

RentPayedBox.propTypes = {
  leaseStatsVM: React.PropTypes.object.isRequired
};

export default RentPayedBox;

