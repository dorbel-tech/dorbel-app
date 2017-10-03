import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Row, Col } from 'react-bootstrap';
import inputValidator from '~/components/FormWrapper/InputValidator';

import './MyProfileEditFields.scss';

class TenantProfileFields extends Component {
  static showPicture = false;

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      isValid: true
    };
  }

  handleInputChange(e) {
    this.setState({isValid: this.isFormValid()});
    this.props.onChange(e, this.state.isValid);
  }

  isFormValid() {
    return true;
  }

  render() {
    let tenant_profile = this.props.section;

    return (
      <Row>
        <Row>
          <Col className="my-profile-input" sm={12}>
            <textarea
              value={tenant_profile.about_you}
              onChange={this.handleInputChange}
              label="כמה מילים על עצמכם"
              name="about_you"
              placeholder="עזרו לבעל הדירה להכיר אתכם טוב יותר. איך אתם כשוכרים? לכמה זמן מעוניינים בדירה?"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <input
              value={tenant_profile.work_place}
              onChange={this.handleInputChange}
              label="מקום עבודה"
              name="work_place"
              placeholder="שם החברה / ארגון"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <input
              value={tenant_profile.position}
              onChange={this.handleInputChange}
              label="תפקיד"
              name="position"
              type="text"
              placeholder="התפקיד שלכם"
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <input
              value={tenant_profile.facebook_url}
              onChange={this.handleInputChange}
              label="לינק לפרופיל הfacebook שלכם"
              name="facebook_url"
              placeholder="העתיקו את הלינק לכאן"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <input
              value={tenant_profile.linkedin_url}
              onChange={this.handleInputChange}
              label="לינק לפרופיל הLinkedIn שלכם"
              name="linkedin_url"
              placeholder="העתיקו את הלינק לכאן"
            />
          </Col>
        </Row>
      </Row >
    );
  }
}

TenantProfileFields.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  section: React.PropTypes.object.isRequired
};

export default TenantProfileFields;
