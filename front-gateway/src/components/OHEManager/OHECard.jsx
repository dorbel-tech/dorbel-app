import React from 'react';
import { Table, Col, Button, Panel, Image} from 'react-bootstrap';
import Icon from '~/components/Icon/Icon';

class OHECard extends React.Component { 
  render() {
    const { ohe } = this.props;

    return (
      <Panel>
          <Col sm={3} >
            <Icon className="pull-right" iconName="dorbel_icon_calendar" />
            <span>{ohe.dateLabel}</span><br/>
            <span>{ohe.timeLabel}</span>
          </Col>
          <Col sm={3} >
            <span>נרשמים לביקור({ohe.registrations.filter(r => r.is_active).length})</span>
          </Col>
          <Table fill responsive className="vertical-middle">
            <tbody>
              {ohe.registrations.map(registration => (
                <tr key={registration.id}>
                  <td><Image src={registration.user.picture} width="50px" circle /></td>
                  <td>{registration.user.first_name} {registration.user.last_name}</td>
                  <td>{registration.is_active ? 'רוצה להגיע' : 'הגעה בוטלה'}</td>
                  <td>{registration.user.phone || ' '}</td>
                  <td>
                    <Button href={registration.user.facebook_link} disabled={!registration.user.facebook_link} bsStyle="link" target="_blank">
                      <i className="fa fa-2x fa-facebook-square"></i>
                    </Button>                  
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
      </Panel>
    );
  }
}

OHECard.propTypes = {
  ohe: React.PropTypes.object.isRequired
};

export default OHECard;
