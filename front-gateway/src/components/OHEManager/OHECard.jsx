import React from 'react';
import { Panel } from 'react-bootstrap';
import Icon from '~/components/Icon/Icon';

class OHECard extends React.Component { 
  render() {
    const { ohe } = this.props;

    return (
      <Panel>
          <Icon className="pull-right" iconName="dorbel_icon_calendar" />
          <span>{ohe.dateLabel}</span><br/>
          <span>{ohe.timeLabel}</span>
      </Panel>
    );
  }
}

OHECard.propTypes = {
  ohe: React.PropTypes.object.isRequired
};

export default OHECard;
