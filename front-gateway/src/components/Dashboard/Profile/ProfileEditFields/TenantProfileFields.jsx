import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FRC } from '~/components/FormWrapper/FormWrapper';

class MyProfileFields extends Component {
  render() {
    let tenantProfile = this.props.profile.user_metadata.tenantProfile;
    tenantProfile = tenantProfile ? tenantProfile : {
      about_you: '',
      work_place: '',
      position: '',
      facebook_url: '',
      linkedin_url: ''
    };

    return (
      <Row>
        <Row>
          <Col className="my-profile-input" sm={12}>
            <FRC.Textarea
              value={tenantProfile.about_you}
              label="כמה מילים על עצמכם"
              name="tenantProfile.about_you"
              layout="vertical"
              placeholder="עזרו לבעל הדירה להכיר אתכם טוב יותר. איך אתם כשוכרים? לכמה זמן מעוניינים בדירה?"
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={tenantProfile.work_place}
              label="מקום עבודה"
              name="tenantProfile.work_place"
              layout="vertical"
              placeholder="שם החברה / ארגון"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={tenantProfile.position}
              label="תפקיד"
              name="tenantProfile.position"
              layout="vertical"
              type="text"
              placeholder="התפקיד שלכם"
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={tenantProfile.facebook_url}
              label="לינק לפרופיל הfacebook שלכם"
              name="tenantProfile.facebook_url"
              layout="vertical"
              placeholder="העתיקו את הלינק לכאן"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={tenantProfile.linkedin_url}
              label="מייל ליצירת קשר"
              name="tenantProfile.linkedin_url"
              layout="vertical"
              placeholder="העתיקו את הלינק לכאן"
            />
          </Col>
        </Row>
      </Row >
    );
  }
}

MyProfileFields.propTypes = {
  profile: React.PropTypes.object.isRequired
};

export default MyProfileFields;
