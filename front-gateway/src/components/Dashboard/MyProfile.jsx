import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row, Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import SubmitButton from '~/components/SubmitButton/SubmitButton';
import TabBar from '~/components/TabBar/TabBar';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';

import MyProfileFields from './MyProfile/MyProfileFields';
import MyTenantProfileFields from './MyProfile/MyTenantProfileFields';

import './MyProfile.scss';

@inject('appStore', 'appProviders') @observer
class MyProfile extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.tabs = [
      { key: 'me', title: 'פרטי קשר', content: MyProfileFields },
      { key: 'tenant', title: 'פרופיל דייר', content: MyTenantProfileFields }
    ];

    this.state = {
      activeTab: this.tabs[0],
      isValid: false
    };
  }

  changeTab(activeTab) {
    this.setState({ activeTab });
  }

  submit() {
    let formsy = this.refs.form.refs.formsy;

    if (formsy.isChanged()) {
      const profile = formsy.getModel();
      const notificationProvider = this.props.appProviders.notificationProvider;
      return this.props.appProviders.authProvider.updateUserProfile(profile)
        .then(() => { notificationProvider.success('הפרטים עודכנו בהצלחה'); })
        .catch(notificationProvider.error);
    }
  }

  renderActiveSection(profile) {
    return (<this.state.activeTab.content profile={profile} />);
  }

  showPreview(profile) {
    this.props.appProviders.modalProvider.showInfoModal({
      title: 'פרופיל דייר',
      body: <TenantProfile profile={profile} isPreview={true}/>,
    });
  }

  render() {
    const { authStore } = this.props.appStore;

    const profile = authStore.profile;

    return (
      <Grid fluid className="profile-container">
        <TabBar tabs={this.tabs} activeKey={this.state.activeTab.key} onChangeTab={this.changeTab} />
        <Row className="profile-edit-wrapper">
          <div className="profile-header">
            <div className="profile-title pull-right">{this.state.activeTab.title}</div>
            <Button className="profile-preview pull-left" onClick={() => { this.showPreview(profile); }}>
              תצוגה מקדימה&nbsp;
              <i className='fa fa-external-link' />
            </Button>
          </div>
          <div className="profile-edit-container">
            <div className={this.state.activeTab.content.showPicture ? 'profile-picture-container' : 'hidden'}>
              <img className="profile-picture" src={profile.picture} />
            </div>
            <Row>
              <FormWrapper.Wrapper className="profile-form" ref="form"
                onInvalid={() => { this.setState({ isValid: false }); }}
                onValid={() => { this.setState({ isValid: true }); }}>
                {this.renderActiveSection(profile)}
                <Row>
                  <SubmitButton disabled={!this.state.isValid} onClick={this.submit} className="profile-submit"
                    bsStyle="success">
                    עדכון פרטים
                  </SubmitButton>
                </Row>
              </FormWrapper.Wrapper>
            </Row>
          </div>
        </Row>
      </Grid>
    );
  }
}

MyProfile.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default MyProfile;
