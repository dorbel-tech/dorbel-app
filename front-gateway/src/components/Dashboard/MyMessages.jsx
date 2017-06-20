import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { setIntercomStyle } from '~/providers/utils';

import './MyMessages.scss';

@inject('appStore', 'appProviders') @observer
class MyMessages extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const profile = this.props.appStore.authStore.profile;

    Talk.ready.then(() => {
      var me = new Talk.User({
        id: profile.dorbel_user_id,
        name: profile.first_name,
        email: profile.email,
        photoUrl: profile.picture,
        welcomeMessage: 'Hey there! Love to chat :-)'
      });

      window.talkSession = new Talk.Session({
        appId: 'taEQQ8AS',
        publishableKey: 'pk_test_7L5d4GmL6LAj26pjg31VZVY',
        me: me
      });

      var inbox = talkSession.createInbox();
      inbox.mount(document.getElementById('talkjs-inbox-container'));

      setIntercomStyle('none');
    });
  }

  render() {
    return (
      <div className="my-messages-container">
        <div id="talkjs-inbox-container"></div>
      </div>
    );
  }
}

MyMessages.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default MyMessages;
