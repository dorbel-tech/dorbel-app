import React from 'react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';

@inject('appStore', 'appProviders') @observer
class SelectuploadMode extends UploadApartmentBaseStep.wrappedComponent {
  constructor(props) {
    super(props);
    this.navProvider = this.props.appProviders.navProvider;
    autobind(this);
  }

  render() {
    return (
      <Grid fluid className="upload-apt-wrapper">
        <Row>
          <Col xs={12} className="upload-apt-left-container apartment-pictures-step">
            <Col xs={12} md={6}>
              <a href="/apartments/new_form/manage" onClick={this.navProvider.handleHrefClick}>
                ניהול
              </a>
            </Col>
            <Col xs={12} md={6}>
              <a href="/apartments/new_form/publish" onClick={this.navProvider.handleHrefClick}>
                פרסום
              </a>
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}

SelectuploadMode.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object
};

export default SelectuploadMode;
