import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import autobind from 'react-autobind';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { getUserNickname, getListingTitle, hideIntercom } from '~/providers/utils';
import './TenantProfile.scss';

const emptyFieldText = 'אין פירוט';
const contactDetailsTypeToStateName = {
  phone: 'showPhone',
  email: 'showEmail'
};

@inject('appProviders')
class TenantProfile extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      showPhone: false,
      showEmail: false
    };
  }

  componentDidMount() {
    hideIntercom(true);
  }

  componentWillUnmount() {
    this.popup && this.popup.destroy();
    hideIntercom(false);
  }

  renderHeader(profile) {
    const nameBackground = { backgroundImage: `url('${profile.picture}')` };

    return (
      <div className="tenant-profile-header">
        <div className="tenant-profile-header-title">
          פרופיל דייר
        </div>
        <Image className="tenant-profile-header-picture" src={profile.picture} circle />
        <div className="tenant-profile-header-backgound" style={nameBackground}>
        </div>
      </div>
    );
  }

  renderAboutMe(tenantProfile) {
    return tenantProfile.about_you &&
      <Row className="tenant-profile-border-bottom">
        <Col md={8} mdOffset={2} className="tenant-profile-field">
          <label>על עצמי</label>
          <span>{tenantProfile.about_you}</span>
        </Col>
      </Row>;
  }

  renderSocial(tenantProfile) {
    return (
      <Col md={4} sm={4}>
        <div className="tenant-profile-field">
          <label>רשתות חברתיות</label>
          <Button
            href={tenantProfile.facebook_url}
            title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם חברים משותפים' : ''}
            className="tenant-profile-social-link-button facebook"
            disabled={!tenantProfile.facebook_url}
            target="_blank">
            <i className="fa fa-facebook-square"></i> פרופיל פייסבוק
          </Button>
          <Button
            href={tenantProfile.linkedin_url}
            title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם מכרים משותפים' : ''}
            className="tenant-profile-social-link-button linkedin"
            disabled={!tenantProfile.linkedin_url}
            target="_blank">
            <i className="fa fa-linkedin-square"></i> פרופיל לינקדאין
          </Button>
        </div>
      </Col>
    );
  }

  renderDetails(profile) {
    return (
      <Row className="tenant-profile-field">
        <Col md={2} mdOffset={2} sm={3} xs={4} className="tenant-profile-contact-details-item">
          <label>יצירת קשר</label>
          <Button className="chat" bsStyle="success" onClick={this.handleMsgClick}>
            <i className="fa fa-comments" />
            שלח הודעה
          </Button>
        </Col>
        <Col md={2} sm={3} xs={4} className="tenant-profile-contact-details-item">
          <label />
          {this.renderRevealContactDetailsButton('email', 'הצג דוא"ל', 'envelope-o',
            <a href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          )}
        </Col>
        <Col md={2} sm={3} xs={4} className="tenant-profile-contact-details-item">
          <label />
          {this.renderRevealContactDetailsButton('phone', 'הצג טלפון', 'phone',
            <a href={`tel:${profile.phone}`}>
              {profile.phone}
            </a>
          )}
        </Col>
        <Col md={4} sm={3} xs={12} className="tenant-profile-contact-details-item">
          <label>מידע נוסף על הדייר</label>
          <Button href="https://www.dorbel.com/pages/services/credit-report?utm_source=tenant-profile" target="_blank" onClick={() => window.analytics.track('client_click_tenant_credit_score')}>{'דו"ח אשראי'}</Button>
        </Col>
      </Row>
    );
  }

  renderRevealContactDetailsButton(contactDetailsType, buttonText, faIconName, nodeToReveal) {
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
          <i className={'fa fa-' + faIconName} />
          {buttonText}
        </Button >
    );
  }

  handleMsgClick() {
    const { isPreview, profile, listing } = this.props;
    const { messagingProvider } = this.props.appProviders;

    if (listing && !isPreview) {
      const withUserObj = {
        id: profile.dorbel_user_id,
        name: getUserNickname(profile),
        email: profile.email,
        welcomeMessage: 'באפשרותך לשלוח הודעה לדיירים עם הפרטים והזמנה לראות דירה.'
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
    const tenantProfile = profile.tenant_profile || {};

    return (
      <Row className="tenant-profile">
        {this.renderHeader(profile)}
        <div className="tenant-profile-name">
          {`${profile.first_name} ${profile.last_name}`}
        </div>
        <Row className="tenant-profile-border-bottom">
          <Col md={3} mdOffset={2} sm={4} xs={6} className="tenant-profile-field tenant-profile-occupation-field">
            <label>עיר</label>
            <span>{tenantProfile.location || emptyFieldText}</span>
          </Col>
          <Col md={3} xs={6} sm={4} className="tenant-profile-field tenant-profile-occupation-field">
            <label>גיל</label>
            <span>{tenantProfile.age || emptyFieldText}</span>
          </Col>
        </Row>
        <Row className="tenant-profile-border-bottom">
          <Col md={3} mdOffset={2} sm={4} xs={6} className="tenant-profile-field tenant-profile-occupation-field">
            <label>תפקיד</label>
            <span>{tenantProfile.position || emptyFieldText}</span>
          </Col>
          <Col md={3} xs={6} sm={4} className="tenant-profile-field tenant-profile-occupation-field">
            <label>מקום עבודה</label>
            <span>{tenantProfile.work_place || emptyFieldText}</span>
          </Col>
          {this.renderSocial(tenantProfile)}
        </Row>
        {this.renderAboutMe(tenantProfile)}
        {this.renderDetails(profile)}
      </Row>
    );
  }
}

TenantProfile.wrappedComponent.propTypes = {
  appProviders: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  isPreview: PropTypes.bool,
  listing: PropTypes.object
};

export default TenantProfile;
