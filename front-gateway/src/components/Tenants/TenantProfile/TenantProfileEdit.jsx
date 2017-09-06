import React from 'react';
import autobind from 'react-autobind';
import { inject } from 'mobx-react';
import { Grid, Row, Col, Button, Image } from 'react-bootstrap';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';

import './TenantProfileEdit.scss';

@inject('appProviders')
export default class TenantProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static title = (<div>
    <h4>עזרו לבעל הדירה להכיר אתכם -</h4>
    <h4>פרטים בסיסיים</h4>
  </div>)

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

    if (formsy.isChanged() && formsy.state.isValid) {
      const profile = {
        section: 'full_profile',
        data: formsy.getModel()
      };

      const { notificationProvider, modalProvider } = this.props.appProviders;
      return this.props.appProviders.authProvider.updateUserProfile(profile)
        .then(() => {
          notificationProvider.success('הפרטים עודכנו בהצלחה');
          modalProvider.close(true);
        })
        .catch(notificationProvider.error);
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
              <FRC.Input value={profile.first_name} name="first_name" type="text" placeholder="שם פרטי (חובה)" required />
              <FRC.Input value={profile.last_name} name="last_name" type="text" placeholder="שם משפחה (חובה)" required />
              <FRC.Input value={profile.email} name="email" type="email" placeholder="אי-מייל (חובה)" validations="isEmail" required />
              <FRC.Input value={profile.phone} name="phone" type="text" placeholder="טלפון (חובה)" required />
            </div>
            <div className="tenant-profile-edit-form-section">
              <div className="tenant-profile-edit-form-section-title">עבודה</div>
              <div className="tenant-profile-edit-form-section-explain">פרטו על התעסוקה שלכם כדי שבעל הדירה ידע שתוכלו לעמוד בתשלומים</div>
              <FRC.Input value={profile.tenant_profile.work_place} name="tenant_profile.work_place" type="text" placeholder="מקום העבודה/עצמאי (חובה)" required />
              <FRC.Input value={profile.tenant_profile.position} name="tenant_profile.position" type="text" placeholder="התפקיד שלכם (חובה)" required />
            </div>
            <div className="tenant-profile-edit-form-section">
              <div className="tenant-profile-edit-form-section-explain smaller">הוסיפו רשתות חברתיות על מנת לגלות חברים משותפים עם בעל הדירה</div>
              <FRC.Input value={profile.tenant_profile.facebook_url} name="tenant_profile.facebook_url" type="text" placeholder="העתיקו לינק לפרופיל הפייסבוק שלכם" />
              <FRC.Input value={profile.tenant_profile.linkedin_url} name="tenant_profile.linkedin_url" type="text" placeholder="העתיקו לינק לפרופיל הלינקדאין שלכם" />
            </div>
            <div className="tenant-profile-edit-form-section">
              <div className="tenant-profile-edit-form-section-title">ספרו על עצמכם</div>
              <FRC.Textarea
                value={profile.tenant_profile.about_you}
                name="tenant_profile.about_you"
                type="text"
                placeholder="עזרו לבעל הדירה להכיר אתכם טוב יותר. איך אתם כשוכרים? לכמה זמן מעוניינים בדירה? האם אתם עוברים לבד?"
                required />
            </div>
            <Button bsStyle="success" onClick={this.submit} block>אישור</Button>
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