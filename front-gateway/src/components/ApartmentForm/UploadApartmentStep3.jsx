import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import AddOHEInput from '~/components/AddOHEInput/AddOHEInput';
import SubmitButton from '~/components/SubmitButton/SubmitButton';

@inject('appStore', 'appProviders', 'router') @observer
class UploadApartmentStep3 extends UploadApartmentBaseStep.wrappedComponent {

  componentDidMount() {
    // load form with existing values from store
    const { newListingStore } = this.props.appStore;
    const { formsy } = this.refs.form.refs;
    formsy.reset(newListingStore.formValues);
  }

  getHourOptions(hoursArray) {
    return hoursArray.map((hour) => ({ label: hour }));
  }

  clickNext() {
    const formsy = this.refs.form.refs.formsy;
    if (formsy.state.isValid) {
      this.props.appStore.newListingStore.updateFormValues(this.refs.form.refs.formsy.getCurrentValues());
      return super.clickNext();
    } else {
      this.props.onValidationError(formsy);
    }
  }

  onCloseSuccessModal() {
    this.props.appStore.newListingStore.reset();
    this.props.router.setRoute('/dashboard/my-properties/' + this.props.createdListingId);
  }

  renderUserDetails() {
    const { authStore } = this.props.appStore;
    const { authProvider } = this.props.appProviders;
    const FRC = FormWrapper.FRC;

    if (authStore.isLoggedIn) {
      // setting this up specificially because somehow it gets lost when logging in
      const {publishing_user_type, is_phone_visible }= this.props.appStore.newListingStore.formValues.publishing_user_type;
      
      return (
        <div>
          <Row>
            <Col md={6}>
              <FRC.Input name="user.firstname" label="שם פרטי" value={authStore.profile.first_name} required />
            </Col>
            <Col md={6}>
              <FRC.Input name="user.lastname" label="שם משפחה" value={authStore.profile.last_name} required
                placeholder="(לא יוצג באתר)" />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FRC.Input name="user.email" label="מייל" value={authStore.profile.email}
                typea="email" validations="isEmail" validationError="כתובת מייל לא תקינה" required />
            </Col>
            <Col md={6}>
              <FRC.Input validations="isNumeric" name="user.phone" label="טלפון" value={authStore.profile.phone} validationError="מספר טלפון לא תקין" required />
              <div className="is-phone-visible-input">
                <FRC.Checkbox name="is_phone_visible" label="הציגו את המספר שלי במודעה" value={is_phone_visible}/>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FRC.RadioGroup name="publishing_user_type" value={publishing_user_type} type="inline" label="הגדר אותי במודעה כ:"
                options={[{ label: 'בעל הדירה', value: 'landlord' }, { label: 'הדייר הנוכחי', value: 'tenant' }]} />
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <Col sm={6}>
          <Button bsStyle="success" className="verify-user" block onClick={authProvider.showLoginModal}>וידוא פרטי קשר</Button>
        </Col>
      );
    }
  }

  render() {
    const { authStore, newListingStore } = this.props.appStore;
    const existingOhe = _.get(newListingStore, 'formValues.open_house_event');
    const FRC = FormWrapper.FRC;
    let createdListingIdAttr = { 'data-attr': this.props.createdListingId };

    return (
      <Grid fluid className="upload-apt-wrapper">
        <Col md={5} className="upload-apt-right-container">
          <div className="upload-apt-right-container-text-wrapper">
            <div className="upload-apt-right-container-text-container">
              <h1>מועד ביקור ופרטי קשר</h1>
              <ul className="upload-apt-right-container-step3-text-ul">
                <li>בחרו מועד לדיירים לביקור בדירה</li>
                <li>מומלץ לקבוע ביקור בשעות הבוקר/ערב</li>
                <li>פרטי הקשר שלכם ישמשו לעדכונים חשובים בלבד!</li>
              </ul>
            </div>
          </div>
          <img src="https://static.dorbel.com/images/upload-apt-form/icon-signup-card.svg" alt="" />
        </Col>

        <Col md={7} className="upload-apt-left-container open-house-event-step">
          <FormWrapper.Wrapper layout="vertical" onChange={this.handleChanges} ref="form">
            <Row className="form-section">
              <div className="form-section-headline">מועדי ביקור בדירה</div>
              <AddOHEInput validations="oheValidation" name="ohe" onChange={this.handleChange.bind(this, 'open_house_event')} ohe={existingOhe} mode="new" />
              <Row>
                <Col md={12}>
                  <FRC.Textarea name="directions" rows={3} label="הכוונה לדירה בבניין (אם צריך)"
                    placeholder="(לדוגמא: הדלת הלבנה משמאל למדרגות)" />
                </Col>
              </Row>
            </Row>

            <Row className="form-section">
              <div className="form-section-headline">פרטי קשר</div>
              {this.renderUserDetails()}
            </Row>
          </FormWrapper.Wrapper>

          <Col xs={12} md={7} className="form-nav bottom">
            <span className="prev-step step3" onClick={this.clickBack.bind(this)}>
              <i className="open-house-event-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; שלב קודם
            </span>
            <span>3/3</span>
            <SubmitButton onClick={this.clickNext.bind(this)} className="step-btn step3"
              bsStyle={authStore.isLoggedIn ? 'success' : 'default'}
              disabled={!authStore.isLoggedIn} >שליחה וסיום</SubmitButton>
          </Col>
        </Col>
        <DorbelModal
          show={this.props.showSuccessModal}
          onClose={this.onCloseSuccessModal.bind(this)}
          title="תהליך העלאת פרטי הדירה הושלם בהצלחה!"
          body={
            <div className="text-center" {...createdListingIdAttr}>
              <p>
                מודעתכם נמצאת בתהליך אישור. עדכון יישלח אליכם ברגע שהיא תעלה לאתר.<br />
                הנכם מועברים לחשבון החדש שלכם, בו תוכלו לנהל ולעקוב אחר נתוני הנכס.
              </p>
              <p>
                צוות dorbel
              </p>
              <p>
                <Button bsStyle="info" className="submit-success" onClick={this.onCloseSuccessModal.bind(this)}>קחו אותי לחשבון שלי</Button>
              </p>
            </div>
          }
        />
      </Grid>
    );
  }
}

export default UploadApartmentStep3;
