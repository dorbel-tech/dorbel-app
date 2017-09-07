import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Grid, Row, Col, Button, Image } from 'react-bootstrap';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';
import { hideIntercom } from '~/providers/utils';

import './TenantProfileEdit.scss';

@inject('appProviders')
export default class TenantProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    hideIntercom(true);
  }

  componentWillUnmount() {
    hideIntercom(false);
  }

  static title = (
    <h4>עזרו לבעל הדירה להכיר אתכם - פרטים בסיסיים</h4>
  )

  static profileRequiredFields = [
    'email',
    'first_name',
    'last_name',
    'phone',
    'tenant_profile.about_you',
    'tenant_profile.work_place',
    'tenant_profile.position'
  ]

  submit() {
    const { formsy } = this.refs.form.refs;
    const { notificationProvider, modalProvider } = this.props.appProviders;
    if (formsy.state.isValid) {
      const profile = {
        section: 'full_profile',
        data: formsy.getModel()
      };
      if (formsy.isChanged()) {
        return this.props.appProviders.authProvider.updateUserProfile(profile)
          .then(() => {
            window.analytics.track('client_click_interested_in_apartment_tenant_profile_submit');
            modalProvider.close(true);
          })
          .catch(err => notificationProvider.error(err));
      }
      else {
        modalProvider.close(true);
      }
    }
    else {
      formsy.submit(); // show validation errors
      notificationProvider.error('חסרים פרטים, נא למלא את כל הפרטים')
    }
  }

  render() {
    const { profile } = this.props;
    return (
      <div className="tenant-profile-edit">
        <div className="tenant-profile-edit-heading">
          מלאו את פרטיכם ואפשרו לבעל הדירה להכיר אתכם טוב יותר
        </div>
        <Image src={profile.picture} className="tenant-profile-edit-picture" circle />
        <div className="tenant-profile-edit-form">
          <FormWrapper.Wrapper layout="vertical" ref="form">
            <div className="tenant-profile-edit-form-section">
              <div className="tenant-profile-edit-form-section-title">פרטים אישיים</div>
              <Row>
                <Col xs={12} sm={6}>
                  <FRC.Input value={profile.first_name} name="first_name" type="text" placeholder="שם פרטי (חובה)" required />
                </Col>
                <Col xs={12} sm={6}>
                  <FRC.Input value={profile.last_name} name="last_name" type="text" placeholder="שם משפחה (חובה)" required />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6}>
                  <FRC.Input value={profile.email} name="email" type="email" placeholder="אי-מייל (חובה)" validations="isEmail" required />
                </Col>
                <Col xs={12} sm={6}>
                  <FRC.Input value={profile.phone} name="phone" type="text" placeholder="טלפון (חובה)" required />
                </Col>
              </Row>
            </div>
            <div className="tenant-profile-edit-form-section">
              <div className="tenant-profile-edit-form-section-title">עבודה</div>
              <div className="tenant-profile-edit-form-section-explain">פרטו על התעסוקה שלכם כדי שבעל הדירה יהיה שקט שתוכלו לעמוד בתשלומים</div>
              <Row>
                <Col xs={12} sm={6}>
                  <FRC.Input value={profile.tenant_profile.work_place} name="tenant_profile.work_place" type="text" placeholder="מקום העבודה/עצמאי (חובה)" required />
                </Col>
                <Col xs={12} sm={6}>
                  <FRC.Input value={profile.tenant_profile.position} name="tenant_profile.position" type="text" placeholder="התפקיד שלכם (חובה)" required />
                </Col>
              </Row>
            </div>
            <div className="tenant-profile-edit-form-section">
              <div className="tenant-profile-edit-form-section-title-optional">רשתות חברתיות</div>
              <div className="tenant-profile-edit-form-section-explain">הוסיפו רשתות חברתיות על מנת לגלות חברים משותפים עם בעל הדירה</div>
              <Row>
                <Col xs={12} sm={6}>
                  <FRC.Input value={profile.tenant_profile.linkedin_url} name="tenant_profile.linkedin_url" type="text" placeholder="העתיקו לינק לפרופיל הלינקדאין שלכם" />
                </Col>
                <Col xs={12} sm={6}>
                  <FRC.Input value={profile.tenant_profile.facebook_url} name="tenant_profile.facebook_url" type="text" placeholder="העתיקו לינק לפרופיל הפייסבוק שלכם" />
                </Col>
              </Row>
            </div>
            <div className="tenant-profile-edit-form-section">
              <div className="tenant-profile-edit-form-section-title">ספרו על עצמכם</div>
              <FRC.Textarea
                value={profile.tenant_profile.about_you}
                name="tenant_profile.about_you"
                type="text"
                rows={3}
                placeholder="עזרו לבעל הדירה להכיר אתכם טוב יותר. איך אתם כשוכרים? לכמה זמן מעוניינים בדירה? האם אתם עוברים לבד?"
                required />
            </div>
            <Button className="tenant-profile-edit-button" bsStyle="success" onClick={this.submit} block>שלח לבעל הדירה</Button>
          </FormWrapper.Wrapper>
        </div>
      </div>
    );
  }
}

TenantProfileEdit.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  profile: React.PropTypes.object.isRequired
};
