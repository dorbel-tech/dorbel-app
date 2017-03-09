import React from 'react';
import { Row, Modal, Button, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import autobind from 'react-autobind';

const FRC = FormWrapper.FRC;

@observer(['appStore', 'appProviders'])
class FollowListingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { successfullyFollowed: false };
    autobind(this);
  }

  follow() {
    const formsy = this.refs.form.refs.formsy;
    const { listing, appProviders } = this.props;

    if (formsy.state.isValid) {
      let dataModel = formsy.getModel();
      appProviders.oheProvider.follow(listing, dataModel.user);
      this.setState({ successfullyFollowed: true });
    } else {
      formsy.submit(); // will trigger validation messages
    }
  }

  close() {
    if (this.props.onClose) {
      this.props.onClose();
      this.setState({ successfullyFollowed: false });
    }
  }

  renderFollowSuccess() {
    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>בקשתכם התקבלה</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='text-center'>
            <Col xs={8} xsOffset={2} >
              <p>במידה ובעל הדירה יפרסם בעתיד ביקורים נוספים, תהיו הראשונים לדעת</p>
              <Button bsStyle="success" onClick={this.close}>סגור</Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            לשאלות נוספות ויצירת קשר בנוגע לדירה שלחו לנו מייל: <a href="mailto:homesupport@dorbel.com?Subject=Hello%20again" target="_top">homesupport@dorbel.com</a>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  getModalTitle(listing) {
    if (listing.status === 'listed') {
      return 'אהבתם את הדירה ב{listing.apartment.building.street_name} אבל לא נוח לכם להגיע?';
    } else {
      return 'שמחים שמצאתם דירה שמעניינת אתכם!';
    }
  }

  getModalContent(listing) {
    if (listing.status === 'listed') {
      return 'הזינו את כתובת המייל שלכם בכדי לקבל עדכון במידה ויפורסמו מועדים נוספים לדירה זו:';
    } else {
      return 'ברגע שהדירה תתפרסם להשכרה, נעדכן אתכם במייל, כך שתהיו הראשונים לדעת.';
    }
  }

  renderFollowForm() {
    const { listing, appStore } = this.props;
    const profile = appStore.authStore.profile;

    const email = profile ? profile.email : '';

    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>{this.getModalTitle(listing)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='text-center'>
            <Col xs={8} xsOffset={2} >
              <p>{this.getModalContent(listing)}</p>
              <FormWrapper.Wrapper layout="elementOnly" ref="form">
                <FRC.Input name="user.email" placeholder="מייל" type="email" value={email} validations="isEmail" validationError="כתובת מייל לא תקינה" required />
                <br />
                <Button bsStyle="success" onClick={this.follow}>עדכנו אותי!</Button>
              </FormWrapper.Wrapper>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            לשאלות נוספות ויצירת קשר בנוגע לדירה שלחו לנו מייל: <a href="mailto:homesupport@dorbel.com?Subject=Hello%20again" target="_top">homesupport@dorbel.com</a>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  renderUnfollowSuccess() {
    const { listing, appProviders } = this.props;

    const close = () => {
      const usersFollowDetails = this.props.appStore.oheStore.usersFollowsByListingId.get(listing.id);
      if (usersFollowDetails) {
        appProviders.oheProvider.unfollow(usersFollowDetails);
      }
      this.close();
    };

    // show success modal anyway
    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={close}>
          <Modal.Title>בקשתכם התקבלה</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='text-center'>
            <Col xs={8} xsOffset={2} >
              <p>כתובתכם הוסרה מרשימת התפוצה</p>
              <Button bsStyle="success" onClick={close}>סגור</Button>
            </Col>
          </Row>
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
    const { action, appProviders, appStore } = this.props;
    const allowedActions = {
      follow: this.state.successfullyFollowed ? this.renderFollowSuccess : this.renderFollowForm,
      unfollow: this.renderUnfollowSuccess
    };
    const renderFunc = allowedActions[action];

    if (!renderFunc) {
      return null;
    } else if (!appStore.authStore.isLoggedIn) {
      appProviders.authProvider.showLoginModal();
      return null;
    } else {
      return renderFunc();
    }
  }
}

FollowListingModal.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  onClose: React.PropTypes.func,
  listing: React.PropTypes.object,
  action: React.PropTypes.string
};

export default FollowListingModal;
