import React from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import Icon from '../Icon/Icon';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import './OHERegisterModal.scss';

const FRC = FormWrapper.FRC;

@observer(['appStore', 'appProviders'])
class OHERegisterModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { successfullyRegistered: false };
    // TODO : stop this chaos and use https://github.com/andreypopp/autobind-decorator
    this.close = this.close.bind(this);
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
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
      .then(() => this.close());
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose();
      this.setState({ successfullyRegistered: false });
    }
  }

  renderSuccessModal(profile) {
    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>
            ההרשמה בוצעה בהצלחה!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
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
            <Button onClick={this.close} bsStyle="primary" bsSize="large" >אחלה!</Button>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }

  renderUnregisterForm(ohe, profile) {
    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>ביטול הגעה לביקור</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
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
        </Modal.Body>
      </Modal>
    );
  }

  renderRegisterForm(ohe, profile) {
    return (
      <Modal className="ohe-register-modal" show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>אנו שמחים שבחרתם להגיע לביקור בנכס :)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            לשאלות נוספות ויצירת קשר בנוגע לדירה שלחו לנו מייל: <a href="mailto:homesupport@dorbel.com?Subject=Hello%20again" target="_top">homesupport@dorbel.com</a>
          </div>
        </Modal.Footer>
      </Modal>
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
