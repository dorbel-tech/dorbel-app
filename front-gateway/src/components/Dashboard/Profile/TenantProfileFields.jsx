import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FRC } from '~/components/FormWrapper/FormWrapper';
import _ from 'lodash';

class MyProfileFields extends Component {
  static showPicture = false;

  render() {
    let profile = this.props.profile;
    let user_metadata = profile.user_metadata || {};
    let tenant_profile = user_metadata.tenant_profile || {
      about_you: '',
      work_place: '',
      position: '',
      facebook_url: _.get(profile, 'identities[0].provider') === 'facebook' ? profile.link : '',
      linkedin_url: ''
    };

    return (
      <Row>
        <Row>
          <FRC.Input value="tenant_profile" name="section" type="hidden" />
          <Col className="my-profile-input" sm={12}>
            <FRC.Textarea
              value={tenant_profile.about_you}
              label="כמה מילים על עצמכם"
              name="data.about_you"
              layout="vertical"
              placeholder="עזרו לבעל הדירה להכיר אתכם טוב יותר. איך אתם כשוכרים? לכמה זמן מעוניינים בדירה?"
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={tenant_profile.work_place}
              label="מקום עבודה"
              name="data.work_place"
              layout="vertical"
              placeholder="שם החברה / ארגון"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={tenant_profile.position}
              label="תפקיד"
              name="data.position"
              layout="vertical"
              type="text"
              placeholder="התפקיד שלכם"
            />
          </Col>
        </Row>
        <Row>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={tenant_profile.facebook_url}
              label="לינק לפרופיל הfacebook שלכם"
              name="data.facebook_url"
              layout="vertical"
              placeholder="העתיקו את הלינק לכאן"
            />
          </Col>
          <Col className="my-profile-input" sm={6}>
            <FRC.Input
              value={tenant_profile.linkedin_url}
              label="לינק לפרופיל הLinkedIn שלכם"
              name="data.linkedin_url"
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
