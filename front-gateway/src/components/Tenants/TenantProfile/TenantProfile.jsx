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
      <Row className="tenant-profile-header">
        <Col xs={12}>
          <div className="tenant-profile-header-title">
            פרופיל דייר
          </div>
          <Image className="tenant-profile-header-picture" src={profile.picture} circle />
          <div className="tenant-profile-header-backgound" style={nameBackground}>
          </div>
        </Col>
      </Row>
    );
  }

  renderAboutMe(tProfile) {
    return tProfile.about_you &&
      <Row className="tenant-profile-border-bottom">
        <Col xs={12}>
          <div className="tenant-profile-field">
            <label>על עצמי</label>
            <span>{tProfile.about_you}</span>
          </div>
        </Col>
      </Row>;
  }

  renderSocial(tProfile) {
    return (
      <Col sm={4}>
        <div className="tenant-profile-field">
          <label>רשתות חברתיות</label>
          <Button
            href={tProfile.facebook_url}
            title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם חברים משותפים' : ''}
            className="tenant-profile-social-link-button facebook"
            disabled={!tProfile.facebook_url}
            target="_blank">
            <i className="fa fa-facebook-square"></i> פרופיל פייסבוק
          </Button>
          <Button
            href={tProfile.linkedin_url}
            title={this.props.isPreview ? 'אפשרו לבעל הדירה לדעת אם יש לכם מכרים משותפים' : ''}
            className="tenant-profile-social-link-button linkedin"
            disabled={!tProfile.linkedin_url}
            target="_blank">
            <i className="fa fa-linkedin-square"></i> פרופיל לינקדאין
          </Button>
        </div>
      </Col>
    );
  }

  renderContactDetails(profile) {
    return (
      <div className="tenant-profile-field">
        <label>יצירת קשר</label>
        <Row>
          <Col sm={4} className="tenant-profile-contact-details-item">
            <Button className="chat" bsStyle="success" onClick={this.handleMsgClick}>
              <i className="fa fa-comments" />
              שלח הודעה
            </Button>
          </Col>
          <Col sm={4} className="tenant-profile-contact-details-item">
            {this.renderRevealContactDetailsButton('email', 'הצג דוא"ל', 'envelope-o',
              <a href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            )}
          </Col>
          <Col sm={4} className="tenant-profile-contact-details-item">
            {this.renderRevealContactDetailsButton('phone', 'הצג טלפון', 'phone',
              <a href={`tel:${profile.phone}`}>
                {profile.phone}
              </a>
            )}
          </Col>
        </Row>
      </div>
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
    const tProfile = profile.tenant_profile || {};

    return (
      <Row className="tenant-profile">
        {this.renderHeader(profile)}
        <div className="tenant-profile-name">
          {`${profile.first_name} ${profile.last_name}`}
        </div>
        <Row className="tenant-profile-border-bottom">
          <Col sm={4} xs={6}>
            <div className="tenant-profile-field tenant-profile-occupation-field">
              <label>תפקיד</label>
              <span>{tProfile.position || emptyFieldText}</span>
            </div>
          </Col>
          <Col sm={4} xs={6}>
            <div className="tenant-profile-field tenant-profile-occupation-field">
              <label>מקום עבודה</label>
              <span>{tProfile.work_place || emptyFieldText}</span>
            </div>
          </Col>
          {tProfile && this.renderSocial(tProfile)}
        </Row>
        {tProfile && this.renderAboutMe(tProfile)}
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
