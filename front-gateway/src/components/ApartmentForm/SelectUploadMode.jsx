import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import { inject } from 'mobx-react';
import Dashboard from '../Dashboard/Dashboard';

const UPLOAD_IMAGE_URL = 'https://static.dorbel.com/images/dashboard/add-property-icon-black.svg';
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
        <Grid fluid >
          <Row>
            <Col>
              <Col className="select-upload-mode-wrapper">
                <Row className="select-upload-mode-header">
                  <div className="select-upload-mode-title">האם אתם מעלים דירה להשכרה או דירה לניהול?</div>
                  <div className="select-upload-mode-subtitle">בעוד 2 דק׳ תסיימו להעלות את הדירה לאתר! בחרו איזו דירה ברצונכם להעלות</div>
                </Row>
                <Row>
                  <Row className="select-upload-mode-items-wrapper">
                    <Col md={6}>
                      <a href="/apartments/new_form/publish" onClick={this.handleHrefClick} className="select-upload-mode-item">
                        <img src={UPLOAD_IMAGE_URL} className="select-upload-mode-item-icon"/>
                        <div className="select-upload-mode-item-text">
                          פרסום דירה להשכרה
                        </div>
                        <div className="select-upload-mode-item-subtext">
                          (מחפשים דיירים חדשים)
                        </div>
                      </a>
                    </Col>
                    <Col md={6}>
                      <a href="/apartments/new_form/manage" onClick={this.handleHrefClick} className="select-upload-mode-item">
                        <img src={UPLOAD_IMAGE_URL} className="select-upload-mode-item-icon"/>
                        <div className="select-upload-mode-item-text">
                          העלאת דירה לניהול
                        </div>
                        <div className="select-upload-mode-item-subtext">
                          (יש לי דיירים קיימים)
                        </div>
                      </a>
                    </Col>
                  </Row>
                </Row>
                <Row>
                  <Row className="select-upload-mode-footer">
                    <Col xs={12}>
                      <div className="select-upload-mode-footer">
                        לפרסום דירה קיימת היכנסו ל
                         <a href="/dashboard/my-properties" onClick={this.handleHrefClick}>נכסים שלי&nbsp;</a>
                        ובחרו בנכס הרלוונטי
                        </div>
                    </Col>
                  </Row>
                </Row>
              </Col>
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
