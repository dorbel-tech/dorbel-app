import React, { Component } from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FRC } from '~/components/FormWrapper/FormWrapper';

import './ProfileEditFields.scss';

class MyProfileFields extends Component {
  static showPicture = true;  static 
  pathParam = 'me'

  renderLockIcon() {
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip id="will-not-be-public">לא יוצג באתר</Tooltip>}>
        <i className="fa fa-lock" />
      </OverlayTrigger>
    );
  }

  render() {
    let user_metadata = this.props.profile.user_metadata || {};
    
    return (
      <Row>
        <Row>
          <FRC.Input value="main" name="section" type="hidden"/>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input value={user_metadata.first_name} label="שם פרטי" name="data.first_name" layout="vertical" type="text" required />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input value={user_metadata.last_name} label="שם משפחה" name="data.last_name" layout="vertical" type="text" required />
            {this.renderLockIcon()}
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input value={user_metadata.phone} label="טלפון" name="data.phone" validations="isNumeric" layout="vertical" placeholder="שם פרטי" required />
            {this.renderLockIcon()}
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input value={user_metadata.email} label="מייל ליצירת קשר" validations="isEmail" name="data.email" layout="vertical" placeholder="שם משפחה" type="text" required />
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
