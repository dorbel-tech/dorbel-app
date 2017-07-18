import React from 'react';
import autobind from 'react-autobind';
import { Row, Col, Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import Icon from '~/components/Icon/Icon';
import FormWrapper from '~/components/FormWrapper/FormWrapper';

import '../style/OHERegisterModal.scss';

const FRC = FormWrapper.FRC;

@inject('appStore', 'appProviders') @observer
class OHERegisterModal extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { successfullyRegistered: false };
  }

  register() {
    const formsy = this.refs.form.refs.formsy;
    const { ohe, appProviders } = this.props;

    if (formsy.state.isValid) {
      let dataModel = formsy.getModel();
      appProviders.oheProvider.registerForEvent(ohe, dataModel.user)
        .then(() => this.setState({ successfullyRegistered: true }));
    } else {
      formsy.submit(); // will trigger validation messages
    }
  }

  unregister() {
    const { ohe, appProviders } = this.props;
    appProviders.oheProvider.unregisterForEvent(ohe)
      .then(() => {
        appProviders.notificationProvider.success('הרשמה למועד ביקור התבטלה בהצלחה')
        this.close()
      });
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose();
      this.setState({ successfullyRegistered: false });
    }
  }

  renderSuccessModal(profile) {
    return (
      <DorbelModal
        show={true}
        onClose={this.close}
        modalSize="large"
        title="ההרשמה בוצעה בהצלחה!"
        body={
          <div className="text-center">
            <Row>
              <p>
                הכתובת המדויקת תשלח אליכם במייל בדקות הקרובות.<br /><br />
                פרטי התקשורת אליהם נשלחה ההודעה:<br />
                מייל: {profile.email}<br />
                מספר נייד: {profile.phone}<br /><br />
                במידה והתעוררה בעיה כלשהי אנא&nbsp;
                <a href="mailto:homesupport@dorbel.com">צרו קשר</a>
                .
              </p>
            </Row>
            <Row>
              <Button onClick={this.close} className="ohe-register-modal-info-button" bsStyle="primary" bsSize="large" >אחלה!</Button>
            </Row>
          </div>
        }
      />
    );
  }

  renderUnregisterForm(ohe, profile) {
    return (
      <DorbelModal
        show={true}
        onClose={this.close}
        modalSize="large"
        title="ביטול הגעה לביקור"
        body={
          <div className="text-center">
            <Row>
              <p>
                היי {profile.first_name}, <br />
                האם אתם בטוחים שברצונכם לבטל את הביקור ?
              </p>
            </Row>
            <Row>
              <Col md={6} className="ohe-unregister-modal-button-col">
                <Button onClick={this.close} bsStyle="info" block>אגיע לביקור</Button>
              </Col>
              <Col md={6} className="ohe-unregister-modal-button-col">
                <Button onClick={this.unregister} bsStyle="danger" block>בטלו את הגעתי</Button>
              </Col>
            </Row>
          </div>
        }
      />
    );
  }

  renderRegisterForm(ohe, profile) {
    return (
      <DorbelModal
        show={true}
        onClose={this.close}
        modalSize="large"
        title="אנו שמחים שבחרתם להגיע לביקור בנכס :)"
        body={
          <div className="ohe-register-modal">
            <Row>
              <Col xs={6} className="modal-date">
                <Icon className="pull-right" iconName="dorbel_icon_calendar" />
                <div className="pull-right">
                  <span className="hidden-xs">&nbsp;תאריך:&nbsp;</span>
                  <span>{ohe.dateLabel}</span>
                </div>
              </Col>
              <Col xs={6} className="modal-time">
                <Icon className="pull-right" iconName="dorbel_icon_clock" />
                <div className="pull-right">
                  <span className="hidden-xs">&nbsp;שעה:&nbsp;</span>
                  <span>{ohe.timeLabel}</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <p>הרשמו לביקור על מנת לקבל את הכתובת המדוייקת ובכדי שבעל הדירה ידע למי לצפות.</p>
              </Col>
              <Col md={6} className="small-text">
                <p>פרטי הקשר שלכם ישמשו לעדכונים חשובים בלבד!</p>
              </Col>
            </Row>
            <FormWrapper.Wrapper layout="vertical" onChange={this.handleChanges} ref="form">
              <Row>
                <Col md={6} className="ohe-modal-input">
                  <FRC.Input layout="vertical" name="user.firstname" label="שם פרטי" value={profile.first_name} required />
                </Col>
                <Col md={6} className="ohe-modal-input">
                  <FRC.Input validations="isNumeric" layout="vertical" name="user.phone" label="טלפון" value={profile.phone} validationError="מספר טלפון לא תקין" required />
                </Col>
                <Col md={6} className="ohe-modal-input">
                  <FRC.Input layout="vertical" name="user.email" label="מייל" type="email" value={profile.email} validations="isEmail" validationError="כתובת מייל לא תקינה" required />
                </Col>
                <Col md={6} className="ohe-register-submit">
                  <Button bsStyle="success" block onClick={this.register}>המשך</Button>
                </Col>
              </Row>
            </FormWrapper.Wrapper>
          </div>
        }
        footer={
          <div className="text-center">
            לשאלות נוספות ויצירת קשר בנוגע לדירה שלחו לנו מייל: <a href="mailto:homesupport@dorbel.com?Subject=Hello%20again" target="_top">homesupport@dorbel.com</a>
          </div>
        }
      />
    );
  }

  render() {
    const { ohe, appStore, appProviders } = this.props;
    const profile = appStore.authStore.profile;

    if (!ohe) {
      return null;
    } else if (!appStore.authStore.isLoggedIn) {
      appProviders.authProvider.showLoginModal();
      return null;
    } else if (this.state.successfullyRegistered) {
      return this.renderSuccessModal(profile);
    } else if (this.props.action === 'ohe-unregister') {
      return this.renderUnregisterForm(ohe, profile);
    } else if (this.props.action === 'ohe-register') {
      return this.renderRegisterForm(ohe, profile);
    } else {
      return null;
    }
  }
}

OHERegisterModal.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  ohe: React.PropTypes.object,
  onClose: React.PropTypes.func,
  action: React.PropTypes.string
};

export default OHERegisterModal;
