import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import { inject } from 'mobx-react';
import Dashboard from '../Dashboard/Dashboard';
import '../Dashboard/Dashboard.scss';


@inject('appProviders')
class SelectUploadMode extends Component {
  constructor(props) {
    super(props);
    this.navProvider = this.props.appProviders.navProvider;
    autobind(this);
  }

  render() {
    return (
      <Grid fluid className="select-upload-mode-wrapper">
        <Row>
          <Col xs={5}>
            <Dashboard />
          </Col>
          <Col xs={7}>
            <Row>
              <h3>האם אתם מעלים דירה להשכרה או דירה לניהול?</h3>
              <h4>בעוד 2 דק׳ תסיימו להעלות את הדירה לאתר! בחרו איזו דירה ברצונכם להעלות</h4>
            </Row>
            <Row>
              <Row>
                <Col xs={12} md={6}>
                  <a href="/apartments/new_form/manage" onClick={this.navProvider.handleHrefClick} className="select-upload-mode-item">
                    ניהול
                </a>
                </Col>
                <Col xs={12} md={6}>
                  <a href="/apartments/new_form/publish" onClick={this.navProvider.handleHrefClick} className="select-upload-mode-item">
                    פרסום
                </a>
                </Col>
              </Row>
            </Row>
          </Col>

        </Row>
      </Grid>
    );
  }
}

SelectUploadMode.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object
};

export default SelectUploadMode;
