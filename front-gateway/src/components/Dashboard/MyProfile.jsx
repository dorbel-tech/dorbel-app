import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';
import SubmitButton from '~/components/SubmitButton/SubmitButton';

import './MyProfile.scss';

@inject('appStore', 'appProviders') @observer
class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false
    };
    autobind(this);
  }

  submit() {
    const profile =this.refs.form.refs.formsy.getModel();
    return this.props.appProviders.authProvider.updateUserProfile(profile);
  }

  renderLockIcon() {
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip id="will-not-be-public">לא יוצג באתר</Tooltip>}>
        <i className="fa fa-lock" />
      </OverlayTrigger>
    );
  }

  render() {
    const { authStore } = this.props.appStore;
    const profile = authStore.profile;

    return (
      <Row className="my-profile-container">
        <Col>
          <span className="my-profile-title">פרטי קשר</span>
          <div className="my-profile-edit-wrapper">
            <div className="my-profile-picture-container">
              <img className="my-profile-picture" src={profile.picture} />
            </div>
            <FormWrapper.Wrapper className="my-profile-form" ref="form"
              onInvalid={() => { this.setState({ isValid: false }); }}
              onValid={() => { this.setState({ isValid: true }); }}>
              <Row>
                <Col className="my-profile-input" sm={6}>
                  <FRC.Input value={profile.first_name} label="שם פרטי" name="first_name" layout="vertical" type="text" placeholder="שמכם הפרטי" required />
                </Col>
                <Col className="my-profile-input pad-label" sm={6}>
                  <FRC.Input value={profile.last_name} label="שם משפחה" name="last_name" layout="vertical" type="text" placeholder="שם משפחתכם" required />
                  {this.renderLockIcon()}
                </Col>
              </Row>
              <Row>
                <Col className="my-profile-input" sm={6}>
                  <FRC.Input value={profile.phone} label="טלפון" name="phone" validations="isNumeric" layout="vertical" placeholder="מספר הנייד שלכם" required />
                  {this.renderLockIcon()}
                </Col>
                <Col className="my-profile-input" sm={6}>
                  <FRC.Input value={profile.email} label="מייל ליצירת קשר" validations="isEmail" name="email" layout="vertical" placeholder="כתובת המייל שלכם" type="text" required />
                </Col>
              </Row>
              <SubmitButton disabled={!this.state.isValid} onClick={this.submit} className="my-profile-submit"
                bsStyle="success">
                עדכון פרטים
              </SubmitButton>
            </FormWrapper.Wrapper>
          </div>
        </Col>
      </Row>
    );
  }
}

MyProfile.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default MyProfile;
