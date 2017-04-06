import React, { Component } from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FRC } from '~/components/FormWrapper/FormWrapper';

import './ProfileEditFields.scss';

class MyProfileFields extends Component {
  static showPicture = true;

  renderLockIcon() {
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip id="will-not-be-public">לא יוצג באתר</Tooltip>}>
        <i className="fa fa-lock" />
      </OverlayTrigger>
    );
  }

  render() {
    let profile = this.props.profile;
    
    return (
      <Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input value={profile.first_name} label="שם פרטי" name="first_name" layout="vertical" type="text" required />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input value={profile.last_name} label="שם משפחה" name="last_name" layout="vertical" type="text" required />
            {this.renderLockIcon()}
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input value={profile.phone} label="טלפון" name="phone" validations="isNumeric" layout="vertical" placeholder="שם פרטי" required />
            {this.renderLockIcon()}
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input value={profile.email} label="מייל ליצירת קשר" validations="isEmail" name="email" layout="vertical" placeholder="שם משפחה" type="text" required />
          </Col>
        </Row>
      </Row>
    );
  }
}

MyProfileFields.propTypes = {
  profile: React.PropTypes.object.isRequired
};

export default MyProfileFields;
