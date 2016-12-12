'use strict';
import React, { PropTypes as T } from 'react';
import { observer } from 'mobx-react';

@observer(['appStore'])
export default class ProfileDetails extends React.Component {
  static propTypes = {
    appStore: T.object
  }

  render() {
    const { appStore } = this.props;
    const profile = appStore.authStore.getProfile();

    return (
      <div>
        <div>
          <img src={profile.picture} />
        </div>
        <div>
          <h3>Profile</h3>
          <p><strong>Name: </strong> 
            {profile.user_metadata ?
              <span>{profile.user_metadata.first_name}&nbsp;{profile.user_metadata.last_name}</span>
              :
              <span>{profile.name}</span>
            }
          </p>
          <p><strong>Email: </strong>
            {profile.user_metadata ?
              <span>{profile.user_metadata.email}</span>
              :
              <span>{profile.email}</span>
            } 
          </p>
          <p><strong>Created At:</strong> {profile.created_at}</p>
          <p><strong>Updated At:</strong> {profile.updated_at}</p>
        </div>
      </div>
    );
  }
}
