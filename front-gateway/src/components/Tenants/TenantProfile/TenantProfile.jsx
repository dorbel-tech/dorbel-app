import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Row, Col, Button, Image } from 'react-bootstrap';

import './TenantProfile.scss';

const emptyFieldText = 'אין פירוט';
const contactDetailsTypeToStateName = {
  phone: 'showPhone',
  email: 'showEmail'
}

class TenantProfile extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      showPhone: false,
      showEmail: false
    }
  }

  renderHeader(profile) {
    const nameBackground = { backgroundImage: `url('${profile.picture}')` };

    return (
      <Row className="tenant-profile-header">
        <Col xs={12}>
          <div className="tenant-profile-header-title">
            פרופיל הדייר של {profile.first_name}
          </div>
          <div className="tenant-profile-header-content">
            <div className="tenant-profile-field">
              <div>
                <label>שם</label>
                <span>{`${profile.first_name} ${profile.last_name}`}</span>
              </div>
              <Image className="tenant-profile-header-content-picture" src={profile.picture} circle />
            </div>
          </div>
          <div className="tenant-profile-header-backgound" style={nameBackground}>
          </div>
        </Col>
      </Row>
    );
  }

  renderOccupation(profile) {
    return (
      <Row>
        <Col xs={12}>
          <div className="tenant-profile-field">
            <label>תפקיד</label>
            <span>{profile.tenant_profile.position || emptyFieldText}</span>
          </div>
          <div className="tenant-profile-field border-bottom">
            <label>מקום עבודה</label>
            <span>{profile.tenant_profile.work_place || emptyFieldText}</span>
          </div>
        </Col>
      </Row>
    );
  }

  renderAboutMe(profile) {
    return profile.tenant_profile.about_you ?
      <Row>
        <Col xs={12}>
          <div className="tenant-profile-field border-bottom">
            <label>על עצמי</label>
            <span>{profile.tenant_profile.about_you}</span>
          </div>
        </Col>
      </Row>
      :
      null;
  }

  renderSocial(profile) {
    return (
      <Row>
        <Col xs={12}>
          <div className="tenant-profile-field border-bottom">
            <label>רשתות חברתיות</label>
            <div className="tenant-profile-social-links">
              <Button
                href={profile.tenant_profile.linkedin_url}
                title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם מכרים משותפים' : ''}
                className="tenant-profile-social-links-item"
                disabled={!profile.tenant_profile.linkedin_url}
                target="_blank">
                פרופיל לינקדאין
              </Button>
              <Button
                href={profile.tenant_profile.facebook_url}
                title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם חברים משותפים' : ''}
                className="tenant-profile-social-links-item pull-left"
                disabled={!profile.tenant_profile.facebook_url}
                target="_blank">
                פרופיל פייסבוק
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  renderContactDetails(profile) {
    return (
      <Row>
        <Col xs={12} className="tenant-profile-contact-details">
          <div className="tenant-profile-field">
            <label>יצירת קשר</label>
            <div>
              <div className="tenant-profile-contact-details-item">
                <span className="tenant-profile-contact-details-item-title">טלפון</span>
                {this.renderRevealContactDetailsButton('phone', 'הצג טלפון',
                  <a className="pull-left" href={`tel:${profile.phone}`}>
                    {profile.phone}
                  </a>
                )}
              </div>
              <div className="tenant-profile-contact-details-item">
                <span className="tenant-profile-contact-details-item-title">דוא"ל</span>
                {this.renderRevealContactDetailsButton('email', 'הצג כתובת דוא"ל',
                  <a className="pull-left" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                )}
              </div>
              <div className="tenant-profile-contact-details-item">
                <span className="tenant-profile-contact-details-item-title">צ'אט</span>
                <Button className="chat" bsStyle="success">
                  <i className="fa fa-comments" />
                  שלח הודעה
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row >
    );
  }

  renderRevealContactDetailsButton(contactDetailsType, buttonText, nodeToReveal) {
    const { profile } = this.props;
    console.log(profile);
    return (
      this.state[contactDetailsTypeToStateName[contactDetailsType]] ?
        nodeToReveal :
        <Button
          onClick={() => {
            if (!this.props.isPreview) {
              window.analytics.track(`landlord_clicked_tenant_contact_details`, { contactDetailsType });
            }
            this.setState({ [contactDetailsTypeToStateName[contactDetailsType]]: true });
          }
          }>
          {buttonText}
        </Button >
    )
  }

  render() {
    const profile = this.props.profile;
    return (
      <Row className="tenant-profile">
        {this.renderHeader(profile)}
        {this.renderOccupation(profile)}
        {this.renderAboutMe(profile)}
        {this.renderSocial(profile)}
        {this.renderContactDetails(profile)}
      </Row>
    );
  }
}

TenantProfile.propTypes = {
  profile: React.PropTypes.object.isRequired,
  isPreview: React.PropTypes.bool
};

export default TenantProfile;
