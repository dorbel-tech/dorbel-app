import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import { inject } from 'mobx-react';
import Dashboard from '../Dashboard/Dashboard';
import { PROPERTY_SUBMIT_PREFIX, DASHBOARD_PREFIX } from '~/routesHelper';

@inject('appProviders')
class SelectUploadMode extends Component {
  static hideFooter = true;

  constructor(props) {
    super(props);
    this.handleHrefClick = this.props.appProviders.navProvider.handleHrefClick;
    autobind(this);
  }

  render() {
    return (
      <Dashboard externalComponent={
        <Grid fluid className="select-upload-mode-wrapper">
          <Row className="select-upload-mode-header">
            <div className="select-upload-mode-title">האם אתם מעלים דירה להשכרה או דירה לניהול?</div>
            <div className="select-upload-mode-subtitle">בעוד 2 דק׳ תסיימו להעלות את הדירה לאתר! בחרו איזו דירה ברצונכם להעלות</div>
          </Row>
          <Row className="select-upload-mode-items-wrapper">
            <Col md={6}>
              <a href={ PROPERTY_SUBMIT_PREFIX + '/publish' } onClick={this.handleHrefClick} className="select-upload-mode-item">
                <img src="https://static.dorbel.com/images/upload-apt-form/dorbel-rent-icon.svg" className="select-upload-mode-item-icon" />
                <div className="select-upload-mode-item-text">
                  פרסום נכס להשכרה
                </div>
                <div className="select-upload-mode-item-subtext">
                  (מחפשים דיירים חדשים)
                </div>
              </a>
            </Col>
            <Col md={6}>
              <a href={ PROPERTY_SUBMIT_PREFIX + '/manage' } onClick={this.handleHrefClick} className="select-upload-mode-item">
                <img src="https://static.dorbel.com/images/upload-apt-form/dorbel-manage-icon.svg" className="select-upload-mode-item-icon" />
                <div className="select-upload-mode-item-text">
                  הוספת נכס מושכר לניהול
                </div>
                <div className="select-upload-mode-item-subtext">
                  (יש לי דיירים קיימים)
                </div>
              </a>
            </Col>
          </Row>
          <Row className="select-upload-mode-footer">
            <Col xs={12}>
              <div className="select-upload-mode-footer">
                לפרסום דירה קיימת היכנסו ל-&nbsp;
                <a href={ DASHBOARD_PREFIX + '/my-properties' } onClick={this.handleHrefClick}>נכסים שלי</a>
                , בחרו בנכס הרלוונטי ופרסמו אותו מחדש.
              </div>
            </Col>
          </Row>
        </Grid>
      } />
    );
  }
}

SelectUploadMode.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object
};

export default SelectUploadMode;
