import React from 'react';
import { Table, Col, Button, Panel, Image, Dropdown, MenuItem } from 'react-bootstrap';
import EditOHEModal from './EditOHEModal';
import DeleteOHEModal from './DeleteOHEModal';
import autobind from 'react-autobind';

import './OHECard.scss';

class OHECard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  showEditModal(show) {
    this.setState({ showEditModal: show });
  }

  showDeleteModal(show) {
    this.setState({ showDeleteModal: show });
  }

  renderOheMenu() {
    const { ohe, editable } = this.props;

    if (!editable) {
      return null;
    } else {
      return (
        <Dropdown id={ohe.id + '_ohe_action'}>
          <Dropdown.Toggle noCaret bsStyle="link">
            <i className="fa fa-ellipsis-v" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-left">
            <MenuItem onClick={() => this.showEditModal(true)}>עריכת מועד ביקור</MenuItem>
            <MenuItem onClick={() => this.showDeleteModal(true)}>מחיקה</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
  }

  renderRegistrations(registrations) {
    if (!registrations) { return null; }

    return (
      <Table fill className="vertical-middle ohe-card-user-table">
        <tbody>
          {registrations.map(registration => (
            <tr key={registration.id} className="ohe-card-user-table-row">
              <td className="ohe-card-user-image-cell"><Image src={registration.user.picture} circle /></td>
              <td className="ohe-card-user-name-cell">{registration.user.first_name} {registration.user.last_name}</td>
              <td className="ohe-card-user-status-cell">{registration.is_active ? 'מתכוון להגיע' : 'הגעה בוטלה'}</td>
              <td className="ohe-card-user-phone-cell"><a href={'tel:' + (registration.user.phone || ' ')}>{registration.user.phone || ' '}</a></td>
              <td className="ohe-card-user-links-cell">
                <Button href={registration.user.facebook_link} disabled={!registration.user.facebook_link} bsStyle="link" target="_blank">
                  <i className={'fa fa-2x fa-facebook-square ' + (registration.user.facebook_link ? '' : 'ohe-card-facebook')}></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  render() {
    const { ohe } = this.props;
    const numberOfActiveRegistrations = ohe.registrations ? ohe.registrations.filter(r => r.is_active).length : 0;

    return (
      <div className="ohe-card-row">
        <Panel>
          <Col xs={6}>
            <i className="ohe-card-row-icon pull-right fa fa-calendar-o" aria-hidden="true"></i>
            <span className="ohe-card-row-date">{ohe.dateLabel} - {ohe.dayLabel + '\''}</span><br />
            <span className="ohe-card-row-time">{ohe.timeLabel}</span>
          </Col>
          <Col xs={6} className="ohe-card-row-reg-num-col">
            <span className={(numberOfActiveRegistrations === 0 ? 'ohe-no-visits' : '')}>נרשמים לביקור ({numberOfActiveRegistrations})</span>
          </Col>
          <div className="ohe-card-menu">
            {this.renderOheMenu()}
          </div>
          {this.renderRegistrations(ohe.registrations)}
        </Panel>
        <EditOHEModal ohe={ohe} show={this.state.showEditModal} onClose={() => this.showEditModal(false)} />
        <DeleteOHEModal ohe={ohe} show={this.state.showDeleteModal} onClose={() => this.showDeleteModal(false)} />
      </div>
    );
  }
}

OHECard.propTypes = {
  ohe: React.PropTypes.object.isRequired,
  editable: React.PropTypes.bool
};

export default OHECard;
