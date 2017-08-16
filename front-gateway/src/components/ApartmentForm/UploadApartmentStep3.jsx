import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import AddOHEInput from '~/components/AddOHEInput/AddOHEInput';
import SubmitButton from '~/components/SubmitButton/SubmitButton';
import ReactTooltip from 'react-tooltip';
import { getDashMyPropsPath } from '~/routesHelper';

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
      this.props.appStore.newListingStore.isFromValid = formsy.state.isValid;
      this.props.onValidationError(formsy);
    }
  }

  socialLogin(e) {
    this.props.appProviders.authProvider.authorize(e.target.name);
  }

  login() {
    const { authProvider } = this.props.appProviders;
    const formModel = this.refs.form.refs.formsy.getModel();

    authProvider.login(formModel.user.email, formModel.user.pass);
  }

  onCloseSuccessModal() {
    const { createdListingId, appProviders, appStore } = this.props;
    const redirectPath = appStore.newListingStore.uploadMode == 'manage' ? '/manage' : '/ohe';

    appStore.newListingStore.reset();
    appProviders.navProvider.setRoute(getDashMyPropsPath({ id: createdListingId }, redirectPath));
  }

  renderUserDetails() {
    const { authStore } = this.props.appStore;
    const FRC = FormWrapper.FRC;

    if (authStore.isLoggedIn) {
      // setting this up specifically because somehow it gets lost when logging in
      const { publishing_user_type, show_phone } = this.props.appStore.newListingStore.formValues.publishing_user_type;

      return (
        <Row className="form-section">
          <div className="form-section-headline">פרטי קשר</div>
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
                <FRC.Input validations="isNumeric" name="user.phone" label="טלפון" value={authStore.profile.phone} validationError="מספר טלפון לא תקין" required />
                <div className="is-phone-visible-input">
                  <FRC.Checkbox name="show_phone" label="הציגו את המספר שלי במודעה" value={show_phone} />
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
        </Row>
      );
    } else {
      return (
        <Row className="form-section">
          <div className="form-section-headline">פרטי קשר</div>
          <Row>
            <Col sm={6}>
              <Button name="facebook" bsStyle="success" block
                      className="upload-apt-login" onClick={this.socialLogin}>
                <i className="fa fa-facebook-f" aria-hidden="true"></i>
                  התחבר באמצעות חשבון פייסבוק</Button>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Button name="google-oauth2" bsStyle="success" block
                      className="upload-apt-login" onClick={this.socialLogin}>
                <i className="fa fa-google" aria-hidden="true"></i>
                      התחבר באמצעות חשבון גוגל</Button>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FRC.Input name="user.email" label="מייל"
                type="email" validations="isEmail" validationError="כתובת מייל לא תקינה" required />
              <FRC.Input name="user.pass" label="סיסמא"
                type="password" validationError="סיסמא לא תקינה" required />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Button bsStyle="success" block onClick={this.login}>התחבר</Button>
            </Col>
          </Row>
        </Row>
      );
    }
  }

  renderOHEFields(newListingStore) {
    if (newListingStore.uploadMode == 'publish' || newListingStore.uploadMode == 'republish') {
      const existingOhe = _.get(newListingStore, 'formValues.open_house_event');
      return (
        <Row className="form-section">
          <div className="form-section-headline">מועדי ביקור בדירה</div>
          <AddOHEInput validations="oheValidation" name="ohe" onChange={this.handleChange.bind(this, 'open_house_event')} ohe={existingOhe} mode="new" />
          <Row>
            <Col md={12}>
              <FormWrapper.FRC.Textarea name="directions" rows={3} label="הכוונה לדירה בבניין (אם צריך)"
                placeholder="(לדוגמא: הדלת הלבנה משמאל למדרגות)" />
            </Col>
          </Row>
        </Row>
      );
    }
  }

  renderSidePanel(newListingStore) {
    let title = '';
    let content;
    switch (newListingStore.uploadMode) {
      case 'publish':
        title = 'מועד ביקור ופרטי קשר';
        content = (
          <ul className="upload-apt-right-container-step3-text-ul">
            <li>בחרו מועד לדיירים לביקור בדירה</li>
            <li>מומלץ לקבוע ביקור בשעות הבוקר/ערב</li>
            <li>פרטי הקשר שלכם ישמשו לעדכונים חשובים בלבד!</li>
          </ul>
        );
        break;
      case 'manage':
        title = 'פרטי קשר וסיום';
        content = (
          <h4>פרטי הקשר שלכם ישמשו לעדכונים חשובים בלבד!</h4>
        );
    }

    return (
      <Col md={5} className="upload-apt-right-container">
        <div className="upload-apt-right-container-text-wrapper">
          <div className="upload-apt-right-container-text-container">
            <h1>{title}</h1>
            {content}
          </div>
        </div>
        <img src="https://static.dorbel.com/images/upload-apt-form/icon-signup-card.svg" alt="" />
      </Col>
    );
  }

  renderPopupBodyText(newListingStore) {
    return newListingStore.uploadMode == 'manage' ?
      (
        <p>הנכם מועברים לחשבון הדירה החדש שלכם, בו תוכלו לנהל ולעקוב אחר נתוני הנכס</p>
      )
      :
      (
        <p>
          מודעתכם נמצאת בתהליך אישור. עדכון יישלח אליכם ברגע שהיא תעלה לאתר.<br />
          הנכם מועברים לחשבון החדש שלכם, בו תוכלו לנהל ולעקוב אחר נתוני הנכס.
        </p>
      );
  }

  render() {
    const { authStore, newListingStore } = this.props.appStore;
    let createdListingIdAttr = { 'data-attr': this.props.createdListingId };

    return (
      <Grid fluid className="upload-apt-wrapper">
        {this.renderSidePanel(newListingStore)}

        <Col md={7} className="upload-apt-left-container open-house-event-step">
          <FormWrapper.Wrapper layout="vertical" onChange={this.handleChanges} ref="form">
            {this.renderOHEFields(newListingStore)}
            {this.renderUserDetails()}
          </FormWrapper.Wrapper>
          <Col xs={12} md={7} className="form-nav bottom">
            <span className="prev-step step3" onClick={this.clickBack.bind(this)}>
              <i className="open-house-event-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; חזור
            </span>
            <span>3/3</span>
            <span className="next-step" data-tip="שדה חובה חסר">
              <SubmitButton onClick={this.clickNext.bind(this)} className="step-btn step3"
                bsStyle={authStore.isLoggedIn ? 'success' : 'default'}
                disabled={!authStore.isLoggedIn} >שליחה וסיום</SubmitButton>
            </span>
            <ReactTooltip type="dark" effect="solid" place="top" disable={newListingStore.isFromValid}/>
          </Col>
        </Col>
        <DorbelModal
          show={this.props.showSuccessModal}
          onClose={this.onCloseSuccessModal.bind(this)}
          title="תהליך העלאת פרטי הדירה הושלם בהצלחה!"
          body={
            <div className="text-center" {...createdListingIdAttr}>
              {this.renderPopupBodyText(newListingStore)}
              <p>
                צוות dorbel
              </p>
              <p>
                <Button bsStyle="info" className="submit-success" onClick={this.onCloseSuccessModal.bind(this)}>קחו אותי לחשבון שלי</Button>
              </p>
            </div>
          }
        />
      </Grid >
    );
  }
}

export default UploadApartmentStep3;
