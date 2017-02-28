import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import _ from 'lodash';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import AddOHEInput from '~/components/AddOHEInput/AddOHEInput';
import SubmitButton from '~/components/SubmitButton/SubmitButton';

@observer(['appStore', 'appProviders', 'router'])
class UploadApartmentStep3 extends UploadApartmentBaseStep.wrappedComponent {

  componentDidMount() {
    // load form with existing values from store
    this.refs.form.refs.formsy.reset(this.props.appStore.newListingStore.formValues);
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
    window.location.href = 'https://www.dorbel.com/pages/services';
  }

  renderUserDetails() {
    const { authStore } = this.props.appStore;
    const { authProvider } = this.props.appProviders;
    const FRC = FormWrapper.FRC;

    if (authStore.isLoggedIn) {
      // setting this up specificially because somehow it gets lost when logging in
      const publishing_user_type = this.props.appStore.newListingStore.formValues.publishing_user_type;

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
                type="email" validations="isEmail" validationError="כתובת מייל לא תקינה" required />
            </Col>
            <Col md={6}>
              <FRC.Input validations="isNumeric" name="user.phone" label="טלפון" value={authStore.profile.phone} validationError="מספר טלפון לא תקין" required
                placeholder="(יוצג לדיירים שנרשמו לביקור בלבד)" />
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
          <Button bsStyle="success" block onClick={authProvider.showLoginModal}>וידוא פרטי קשר</Button>
        </Col>
      );
    }
  }

  render() {
    const { authStore, newListingStore } = this.props.appStore;
    const existingOhe = _.get(newListingStore, 'formValues.open_house_event');
    const FRC = FormWrapper.FRC;

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
          <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/upload-apt-form/icon-signup-card.svg" alt="" />
        </Col>

        <Col md={7} className="upload-apt-left-container open-house-event-step">
          <FormWrapper.Wrapper layout="vertical" onChange={this.handleChanges} ref="form">
            <Row className="form-section">
              <div className="form-section-headline">מועדי ביקור בדירה</div>
              <AddOHEInput validations="oheValidation" name="ohe" onChange={this.handleChange.bind(this, 'open_house_event')} ohe={existingOhe} mode="new" />
              <Row>
                <Col md={12}>
                  <FRC.Textarea name="open_house_event.comments" rows={3} label="הכוונה לדירה בבניין (אם צריך)"
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
            <span className="prev-step" onClick={this.clickBack.bind(this)}>
              <i className="open-house-event-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; שלב קודם
            </span>
            <span>3/3</span>
            <SubmitButton onClick={this.clickNext.bind(this)} className="step-btn"
              bsStyle={authStore.isLoggedIn ? 'success' : 'default'}
              disabled={!authStore.isLoggedIn} >שליחה וסיום</SubmitButton>
          </Col>
        </Col>
        <DorbelModal
          show={this.props.showSuccessModal}
          onClose={this.onCloseSuccessModal.bind(this)}
          title="העלאת הדירה הושלמה!"
          body={
            <div className="text-center">
              <p>
                תהליך העלאת פרטי הדירה הושלם בהצלחה.<br />
                מודעתכם נמצאת כרגע בתהליך אישור. ברגע שהמודעה תעלה לאתר,
                יישלח אליכם עדכון במייל ובהודעת טקסט. במידה ויהיה צורך,
                ניצור עמכם קשר לפני כן.
              </p>
              <p>
                תודה ויום נעים!<br />
                צוות dorbel
              </p>
              <p>
                <Button bsStyle="info" onClick={this.onCloseSuccessModal.bind(this)}>סגור</Button>
              </p>
            </div>
          }
        />
      </Grid>
    );
  }
}

export default UploadApartmentStep3;
