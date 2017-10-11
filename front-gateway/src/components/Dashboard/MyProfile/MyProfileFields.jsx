import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FRC } from '~/components/FormWrapper/FormWrapper';

import './MyProfileEditFields.scss';

class MyProfileFields extends Component {
  static showPicture = true; 

  renderLockIcon() {
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip id="will-not-be-public">יוצג רק לבעלי הדירות שאליהן נרשמתם לביקור</Tooltip>}>
        <i className="fa fa-lock" />
      </OverlayTrigger>
    );
  }

  render() {
    let profile = this.props.profile;

    return (
      <Row>
        <Row>
          <FRC.Input value="main" name="section" type="hidden" />
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={profile.first_name}
              label="שם פרטי" 
              name="data.first_name"
              layout="vertical"
              type="text"
              required />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={profile.last_name}
              label="שם משפחה"
              name="data.last_name"
              layout="vertical"
              type="text"
              required />
            {this.renderLockIcon()}
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={profile.phone}
              label="טלפון"
              name="data.phone"
              validations="isNumeric"
              layout="vertical"
              placeholder="מספר הנייד שלכם"
              required />
            {this.renderLockIcon()}
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={profile.email}
              label="מייל ליצירת קשר"
              validations="isEmail"
              name="data.email"
              layout="vertical"
              placeholder="כתובת המייל שלכם"
              type="text"
              required />
          </Col>
        </Row>
      </Row>
    );
  }
}

MyProfileFields.propTypes = {
  profile: PropTypes.object.isRequired
};

export default MyProfileFields;
