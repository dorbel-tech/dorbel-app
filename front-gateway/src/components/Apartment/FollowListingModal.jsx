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
      appProviders.oheProvider.follow(listing);
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

  renderFollowForm() {
    const { listing, appStore } = this.props;
    const profile = appStore.authStore.getProfile();   
    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>אהבתם את הדירה ב{listing.apartment.building.street_name} אבל לא נוח לכם להגיע ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>          
          <Row className='text-center'>
            <Col xs={8} xsOffset={2} >
              <p>הזינו את כתובת המייל שלכם בכדי לקבל עדכון במידה ויפורסמו מועדים נוספים לדירה זו:</p>
              <FormWrapper.Wrapper layout="elementOnly" ref="form">
                <FRC.Input name="user.email" placeholder="מייל" type="email" value={profile.email} validations="isEmail" validationError="כתובת מייל לא תקינה" required/>
                <br/>
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
    const usersFollowDetails = this.props.appStore.oheStore.usersFollowsByListingId.get(listing.id);

    if (usersFollowDetails) {
      appProviders.oheProvider.unfollow(usersFollowDetails);
    }
    // show success modal anyway
    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>בקשתכם התקבלה</Modal.Title>
        </Modal.Header>
        <Modal.Body>          
          <Row className='text-center'>
            <Col xs={8} xsOffset={2} >
              <p>כתובתכם הוסרה מרשימת התפוצה</p>
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

  render() {
    const { action, appProviders, appStore } = this.props;
    
    let renderFunc = () => null;

    if (this.state.successfullyFollowed) {
      renderFunc = this.renderFollowSuccess;
    } else if (action === 'follow') {
      renderFunc = this.renderFollowForm;
    } else if (action === 'unfollow') {
      renderFunc = this.renderUnfollowSuccess;
    } 

    if (!appStore.authStore.isLoggedIn) {
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
