import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

import './MyProfileEditFields.scss';

class TenantProfileFields extends Component {
  static showPicture = false;

  render() {
    let tenant_profile = this.props.profile.tenant_profile;

    return (
      <Row>
        <Row>
          <input value="tenant_profile" name="section" type="hidden" />
          <Col className="my-profile-input" sm={12}>
            <textarea
              value={tenant_profile.about_you}
              onChange={this.props.onChange}
              label="כמה מילים על עצמכם"
              name="data.about_you"
              placeholder="עזרו לבעל הדירה להכיר אתכם טוב יותר. איך אתם כשוכרים? לכמה זמן מעוניינים בדירה?"
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <input
              value={tenant_profile.work_place}
              onChange={this.props.onChange}
              label="מקום עבודה"
              name="data.work_place"
              placeholder="שם החברה / ארגון"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <input
              value={tenant_profile.position}
              onChange={this.props.onChange}
              label="תפקיד"
              name="data.position"
              type="text"
              placeholder="התפקיד שלכם"
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <input
              value={tenant_profile.facebook_url}
              onChange={this.props.onChange}
              label="לינק לפרופיל הfacebook שלכם"
              name="data.facebook_url"
              placeholder="העתיקו את הלינק לכאן"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <input
              value={tenant_profile.linkedin_url}
              onChange={this.props.onChange}
              label="לינק לפרופיל הLinkedIn שלכם"
              name="data.linkedin_url"
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
  profile: React.PropTypes.object.isRequired
};

export default TenantProfileFields;
