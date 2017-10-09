import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '~/components/FormWrapper/FormInput';

import './MyProfileEditFields.scss';

class TenantProfileFields extends Component {
  static showPicture = false;

  render() {
    const tenant_profile = this.props.section;

    return (
      <Row>
        <Row>
          <Col className="my-profile-input" sm={12}>
            <FormInput
              type="textarea"
              label="כמה מילים על עצמכם"
              value={tenant_profile.about_you}
              onChange={this.props.onChange}
              name="about_you"
              placeholder="עזרו לבעל הדירה להכיר אתכם טוב יותר. איך אתם כשוכרים? לכמה זמן מעוניינים בדירה?"
              required
              invalidText={this.props.invalidFieldMap.about_you} />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FormInput
              value={tenant_profile.work_place}
              onChange={this.props.onChange}
              label="מקום עבודה"
              name="work_place"
              placeholder="שם החברה / ארגון"
              required
              invalidText={this.props.invalidFieldMap.work_place}
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FormInput
              value={tenant_profile.position}
              onChange={this.props.onChange}
              label="תפקיד"
              name="position"
              placeholder="התפקיד שלכם"
              required
              invalidText={this.props.invalidFieldMap.position}
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FormInput
              value={tenant_profile.facebook_url}
              onChange={this.props.onChange}
              label="לינק לפרופיל הfacebook שלכם"
              name="facebook_url"
              placeholder="העתיקו את הלינק לכאן"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FormInput
              value={tenant_profile.linkedin_url}
              onChange={this.props.onChange}
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
  section: React.PropTypes.object.isRequired,
  invalidFieldMap: React.PropTypes.object.isRequired
};

export default TenantProfileFields;
