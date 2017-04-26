import React, { Component } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';

import './TenantProfile.scss';

const emptyFieldText = '- אין פירוט -';

class TenantProfile extends Component {
  renderHeader(profile) {
    const nameBackground = { backgroundImage: `url('${profile.picture}')` };

    return (
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
    );
  }

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
        <Col className="tenant-profile-field vertical border-bottom" xs={12}>
          <label>מי אני</label>
          <span>{profile.tenant_profile.about_you}</span>
        </Col>
      </Row>
      :
      null;
  }

  renderSocial(profile) {
    return (
      <Row>
        <Col className="tenant-profile-field" xs={12}>
          <label>רשתות חברתיות</label>
          <div className="tenant-profile-social-links">
            <Button
              href={profile.tenant_profile.linkedin_url}
              title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם מכרים משותפים' : ''}
              className="tenant-profile-social-links-item"
              disabled={!profile.tenant_profile.linkedin_url}
              bsStyle="link"
              target="_blank">
              <i className={'fa fa-linkedin-square'}></i>
            </Button>
            <Button
              href={profile.tenant_profile.facebook_url}
              title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם חברים משותפים' : ''}
              className="tenant-profile-social-links-item"
              disabled={!profile.tenant_profile.facebook_url}
              bsStyle="link"
              target="_blank">
              <i className={'fa fa-facebook-square'}></i>
            </Button>
          </div>
        </Col>
      </Row>
    );
  }

  renderPhone(profile) {
    return (
      <Row>
        <Col className="tenant-profile-field" xs={12}>
          <label>טלפון</label>
          <span>
            <a href={profile.phone ? `tel:${profile.phone}` : ''}>
              <span>{profile.phone || '-'}</span>
            </a>
          </span>
        </Col>
      </Row>
    );
  }

  renderEmail(profile) {
    return (
      <Row>
        <Col className="tenant-profile-field pad-bottom" xs={12}>
          <label>דואר אלקטרוני</label>
          <a href={`mailto:${profile.email}`}>
            <span>{profile.email}</span>
          </a>
        </Col>
      </Row>
    );
  }

  render() {
    const profile = this.props.profile;

    return (
      <Row className="tenant-profile">
        {this.renderHeader(profile)}
        {this.renderOccupation(profile)}
        {this.renderAboutMe(profile)}
        {this.renderSocial(profile)}
        {this.renderPhone(profile)}
        {this.renderEmail(profile)}
      </Row>
    );
  }
}

TenantProfile.propTypes = {
  profile: React.PropTypes.object.isRequired,
  isPreview: React.PropTypes.bool
};

export default TenantProfile;
