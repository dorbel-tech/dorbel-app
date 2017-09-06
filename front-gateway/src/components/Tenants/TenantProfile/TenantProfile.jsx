import React, { Component } from 'react';
import { inject } from 'mobx-react';
import autobind from 'react-autobind';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { getUserNickname, getListingTitle, hideIntercom } from '~/providers/utils';

import './TenantProfile.scss';

const emptyFieldText = 'אין פירוט';
const contactDetailsTypeToStateName = {
  phone: 'showPhone',
  email: 'showEmail'
}

@inject('appProviders')
class TenantProfile extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      showPhone: false,
      showEmail: false
    }
  }

  componentWillUnmount() {
    this.popup && this.popup.destroy();
    hideIntercom(false);
  }

  renderHeader(profile) {
    const nameBackground = { backgroundImage: `url('${profile.picture}')` };

    return (
      <Row className="tenant-profile-header">
        <Col xs={12}>
          <div className="tenant-profile-header-title">
            פרופיל הדייר
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
      <Row className="tenant-profile-border-bottom">
        <Col xs={6}>
          <div className="tenant-profile-field">
            <label>מקום עבודה</label>
            <span>{profile.tenant_profile.work_place || emptyFieldText}</span>
          </div>
        </Col>
        <Col xs={6}>
          <div className="tenant-profile-field">
            <label>תפקיד</label>
            <span>{profile.tenant_profile.position || emptyFieldText}</span>
          </div>
        </Col>
      </Row>
    );
  }

  renderAboutMe(profile) {
    return profile.tenant_profile.about_you ?
      <Row className="tenant-profile-border-bottom">
        <Col xs={12}>
          <div className="tenant-profile-field">
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
      <Row className="tenant-profile-border-bottom">
        <Col xs={12}>
          <div className="tenant-profile-field">
            <label>רשתות חברתיות</label>
            <div className="tenant-profile-social-links">
              <Button
                href={profile.tenant_profile.linkedin_url}
                title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם מכרים משותפים' : ''}
                className="tenant-profile-social-links-item linkedin"
                disabled={!profile.tenant_profile.linkedin_url}
                target="_blank">
                <i className="fa fa-linkedin-square"></i> לינקדאין
              </Button>
              <Button
                href={profile.tenant_profile.facebook_url}
                title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם חברים משותפים' : ''}
                className="tenant-profile-social-links-item facebook"
                disabled={!profile.tenant_profile.facebook_url}
                target="_blank">
                <i className="fa fa-facebook-square"></i> פייסבוק
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
            <div className="tenant-profile-contact-details-item">
              <Button className="chat" bsStyle="success" onClick={this.handleMsgClick}>
                <i className="fa fa-comments" />
                שלח הודעה
              </Button>
            </div>
            <div className="tenant-profile-contact-details-item">
              {this.renderRevealContactDetailsButton('email', 'הצג מייל',
                <a className="pull-left" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              )}
            </div>
            <div className="tenant-profile-contact-details-item">
              {this.renderRevealContactDetailsButton('phone', 'הצג טלפון',
                <a className="pull-left" href={`tel:${profile.phone}`}>
                  {profile.phone}
                </a>
              )}
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  renderRevealContactDetailsButton(contactDetailsType, buttonText, nodeToReveal) {
    return (
      this.state[contactDetailsTypeToStateName[contactDetailsType]] ?
        nodeToReveal :
        <Button
          onClick={() => {
            if (!this.props.isPreview) {
              const { profile, listing } = this.props;
              const eventName = 'client_click_tenant_contact_' + contactDetailsType;
              window.analytics.track(eventName, {
                listingId: listing.id,
                tenantUserId: profile.dorbel_user_id
              });
            }
            this.setState({ [contactDetailsTypeToStateName[contactDetailsType]]: true });
          }}>
          {buttonText}
        </Button >
    )
  }

  handleMsgClick() {
    const { isPreview, profile, listing } = this.props;
    const { messagingProvider } = this.props.appProviders;

    if (listing && !isPreview) {
      const withUserObj = {
        id: profile.dorbel_user_id,
        name: getUserNickname(profile),
        email: profile.email,
        welcomeMessage: 'באפשרותך לשלוח הודעה לדיירים. במידה והם אינם מחוברים הודעתך תישלח אליהם למייל.'
      };

      window.analytics.track('client_click_tenant_contact_message', {
        listingId: listing.id,
        tenantUserId: profile.dorbel_user_id
      });

      messagingProvider.getOrStartConversation(withUserObj, {
        topicId: listing.id,
        subject: getListingTitle(listing)
      }).then(popup => this.popup = popup);
    }
  }

  render() {
    const profile = this.props.profile;

    return (
      <Row className="tenant-profile">
        {this.renderHeader(profile)}
        {this.renderOccupation(profile)}
        {this.renderSocial(profile)}
        {this.renderAboutMe(profile)}
        {this.renderContactDetails(profile)}
      </Row>
    );
  }
}

TenantProfile.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object.isRequired,
  isPreview: React.PropTypes.bool,
  listing: React.PropTypes.object
};

export default TenantProfile;
