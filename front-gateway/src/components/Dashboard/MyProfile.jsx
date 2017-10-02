import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Tabs, Tab, Grid, Row, Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import { find } from 'lodash';
import { getMyProfilePath } from '~/routesHelper';
import SubmitButton from '~/components/SubmitButton/SubmitButton';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';
import MySettingsFields from './MyProfile/MySettingsFields';
import MyProfileFields from './MyProfile/MyProfileFields';
import MyTenantProfileFields from './MyProfile/MyTenantProfileFields';

import './MyProfile.scss';

@inject('appStore', 'appProviders', 'router') @observer
class MyProfile extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.tabs = [
      { key: 'settings', title: 'הגדרות', content: MySettingsFields, submitText: 'שמור שינויים' },
      { key: 'me', title: 'פרטי קשר', content: MyProfileFields },
      { key: 'tenant', title: 'פרופיל דייר', content: MyTenantProfileFields }
    ];

    this.state = {
      isValid: false
    };
  }

  submit() {
/*    if (formsy.isChanged()) {
      const profile = formsy.getModel();
      const notificationProvider = this.props.appProviders.notificationProvider;
      return this.props.appProviders.authProvider.updateUserProfile(profile)
        .then(() => { notificationProvider.success('הפרטים עודכנו בהצלחה'); })
        .catch(notificationProvider.error);
    }*/
  }

  handleInputChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  renderActiveSection(activeTab, profile) {
    return (<activeTab.content profile={profile} onChange={this.handleInputChange}/>);
  }

  showPreview(profile) {
    this.props.appProviders.modalProvider.showInfoModal({
      closeButton: true,
      body: <TenantProfile profile={profile} isPreview={true}/>,
      modalSize: 'large'
    });
  }

  handleTabSelect(e) {
    this.props.router.setRoute(getMyProfilePath(e.key));
  }

  render() {
    const { authStore } = this.props.appStore;
    const profile = authStore.profile;
    const activeTab = find(this.tabs, { key: this.props.tab }) || this.tabs[0];
    const formChanged = this.form && this.form.refs.formsy.isChanged();

    return (
      <Grid fluid className="profile-container">
        <Tabs className="tab-menu" activeKey={activeTab}
          onSelect={this.handleTabSelect} id="my-profile-tabs">
          {this.tabs.map(tab =>
            <Tab eventKey={tab} key={tab.key} title={tab.title}></Tab>
          )}
        </Tabs>
        <Row className="profile-edit-wrapper">
          <div className="profile-header">
            <div className="profile-title pull-right">{activeTab.title}</div>
            <Button className={'profile-preview pull-left profile-preview-' + activeTab.key} onClick={() => { this.showPreview(profile); }}>
              תצוגה מקדימה
            </Button>
          </div>
          <div className="profile-edit-container">
            <div className={activeTab.content.showPicture ? 'profile-picture-container' : 'hidden'}>
              <img className="profile-picture" src={profile.picture} />
            </div>
            <Row>
              <form className="profile-form" onSubmit={this.submit}>
                {this.renderActiveSection(activeTab, profile)}
                <Row>
                  <SubmitButton disabled={!formChanged || !this.state.isValid} onClick={this.submit} className="profile-submit"
                    bsStyle="success">
                    {activeTab.submitText || 'עדכון פרטים'}
                  </SubmitButton>
                </Row>
              </form>
            </Row>
          </div>
        </Row>
      </Grid>
    );
  }
}

MyProfile.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
  tab: React.PropTypes.string
};

export default MyProfile;
