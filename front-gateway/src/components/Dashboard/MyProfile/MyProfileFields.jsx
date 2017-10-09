import React, { Component } from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FormInput from '~/components/FormWrapper/FormInput';

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
    let profile = this.props.section;

    return (
      <Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FormInput
              value={profile.first_name}
              onChange={this.props.onChange}
              label="שם פרטי" 
              name="first_name"
              required
              invalidText={this.props.invalidFieldMap.first_name} />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FormInput
              value={profile.last_name}
              onChange={this.props.onChange}
              label="שם משפחה"
              name="last_name"
              required
              invalidText={this.props.invalidFieldMap.last_name} />
            {this.renderLockIcon()}
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FormInput
              value={profile.phone}
              onChange={this.props.onChange}
              label="טלפון"
              name="phone"
              type="tel"
              placeholder="מספר הנייד שלכם"
              required
              invalidText={this.props.invalidFieldMap.phone} />
            {this.renderLockIcon()}
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FormInput
              value={profile.email}
              onChange={this.props.onChange}
              label="מייל ליצירת קשר"
              type="email"
              name="email"
              placeholder="כתובת המייל שלכם"
              required
              invalidText={this.props.invalidFieldMap.email} />
          </Col>
        </Row>
      </Row>
    );
  }
}

MyProfileFields.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  section: React.PropTypes.object.isRequired,
  invalidFieldMap: React.PropTypes.object.isRequired
};

export default MyProfileFields;
