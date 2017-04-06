import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import SubmitButton from '~/components/SubmitButton/SubmitButton';
import TabBar from '../../TabBar/TabBar';

import MyProfileFields from './ProfileEditFields/MyProfileFields';
import TenantProfileFields from './ProfileEditFields/TenantProfileFields';

import './Profile.scss';

@observer(['appStore', 'appProviders'])
class Profile extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.tabs = [
      { name: 'my', title: 'פרטי קשר', content: MyProfileFields },
      { name: 'tenant', title: 'פרטי דייר', content: TenantProfileFields }
    ];

    this.state = {
      activeSection: MyProfileFields,
      isValid: false
    };
  }

  changeTab(activeTab) {
    this.tabs.map((tab) => { tab.isActive = (tab.name == activeTab.name); });
    this.setState({ activeSection: activeTab.content });
  }

  submit() {
    const profile = this.refs.form.refs.formsy.getModel();
    return this.props.appProviders.authProvider.updateUserProfile(profile);
  }

  renderActiveSection(profile) {
    return (<this.state.activeSection profile={profile} />);
  }

  render() {
    const { authStore } = this.props.appStore;
    const profile = authStore.profile;

    return (
      <Grid className="profile-container">
        <Row className="profile-nav-tabs">
          <TabBar tabs={this.tabs} onClick={this.changeTab} />
        </Row>
        <Row className="profile-edit-wrapper">
          <div className="profile-title">פרטי קשר</div>
          <div className="profile-edit-container">
            <div className={this.state.activeSection.showPicture ? 'profile-picture-container' : 'hidden'}>
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

Profile.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Profile;
