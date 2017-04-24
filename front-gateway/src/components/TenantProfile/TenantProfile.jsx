import React, { Component } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';

import './TenantProfile.scss';

const emptyFieldText = '- אין פירוט -';

class TenantProfile extends Component {
  renderOccupation(profile) {
    return (profile.tenant_profile.work_place || profile.tenant_profile.position) ?
      <Row>
        <Col className="tenant-profile-field vertical" xs={6}>
          <label>תפקיד</label>
          <span>{profile.tenant_profile.position || emptyFieldText}</span>
        </Col>
        <Col className="tenant-profile-field vertical" xs={6}>
          <label>חברה</label>
          <span>{profile.tenant_profile.work_place || emptyFieldText}</span>
        </Col>
      </Row>
      :
      null;
  }


  renderAboutMe(profile) {
    return profile.tenant_profile.about_you ?
      <Row>
        <Col className="tenant-profile-field vertical bordered" xs={12}>
          <label>מי אני</label>
          <span>{profile.tenant_profile.about_you}</span>
        </Col>
      </Row>
      :
      null;
  }

  render() {
    const profile = this.props.profile;
    const nameBackground = { backgroundImage: `url('${profile.picture}')` };
    return (
      <Row className="tenant-profile">
        <Row >
          <Col className="tenant-profile-header">
            <Row className="tenant-profile-header-content">
              <Col className="tenant-profile-field vertical" xs={8}>
                <div>
                  <label>שם</label>
                  <span>{`${profile.first_name} ${profile.last_name}`}</span>
                </div>
              </Col>
              <Col className="tenant-profile-header-content-picture" xs={4}>
                <Image src={profile.picture} circle />
              </Col>
            </Row>
            <div className="tenant-profile-header-backgound" style={nameBackground}>
            </div>
          </Col>
        </Row>
        {this.renderOccupation(profile)}
        {this.renderAboutMe(profile)}
        <Row>
          <Col className="tenant-profile-field" xs={12}>
            <label>רשתות חברתיות</label>
            <div className="tenant-profile-social-links">
              <Button href={profile.tenant_profile.linkedin_url} className="social-link" disabled={!profile.tenant_profile.linkedin_url} bsStyle="link" target="_blank">
                <i className={'fa fa-linkedin-square'}></i>
              </Button>
              <Button href={profile.tenant_profile.facebook_url} className="social-link" disabled={!profile.tenant_profile.facebook_url} bsStyle="link" target="_blank">
                <i className={'fa fa-facebook-square'}></i>
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="tenant-profile-field" xs={12}>
            <label>טלפון</label>
            <span>{profile.phone || '-'}</span>
          </Col>
        </Row>
        <Row>
          <Col className="tenant-profile-field padded-bottom" xs={12}>
            <label>דואר אלקטרוני</label>
            <span>{profile.email}</span>
          </Col>
        </Row>
      </Row >
    );
  }
}

TenantProfile.propTypes = {
  profile: React.PropTypes.object.isRequired,
  isPreview: React.PropTypes.bool
};

export default TenantProfile;
