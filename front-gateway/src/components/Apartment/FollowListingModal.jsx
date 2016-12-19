import React from 'react';
import { Row, Modal, Button, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import FormWrapper from '~/components/FormWrapper/FormWrapper';

const FRC = FormWrapper.FRC;

@observer(['appStore', 'appProviders'])
class FollowListingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { successfullyFollowed: false };
    this.close = this.close.bind(this);
    this.follow = this.follow.bind(this);
    this.follow = this.follow.bind(this);
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

  renderFollowForm(listing, profile) {
    return (
      <Modal show={true}>
        <Modal.Header closeButton onHide={this.close}>
          <Modal.Title>אהבתם את הדירה ב{listing.apartment.building.street_name} אבל לא נוח לכם להגיע ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>          
          <Row className='text-center'>
            <Col xs={8} xsOffset={2} >
              <p>הזינו את כתובת המייל שלכם בכדי לקבל עדכון במידה ויפורסמו מועדים נוספים לדירה זו:</p>
              <FormWrapper.Wrapper layout="elementOnly" onChange={this.handleChanges} ref="form">
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

  render() {
    const { action, listing, appProviders, appStore } = this.props;
    const profile = appStore.authStore.getProfile();    
    
    if (!listing) {
      return null; 
    } else if (!appStore.authStore.isLoggedIn) {
      appProviders.authProvider.showLoginModal();
      return null;
    } else if (this.state.successfullyFollowed) {
      return this.renderFollowSuccess();
    } else if (action === 'follow') {
      return this.renderFollowForm(listing, profile);
    } else {
      return null;
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
