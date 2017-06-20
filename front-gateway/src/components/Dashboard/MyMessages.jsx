import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import talkjs from '~/talk'

import './MyMessages.scss';

@inject('appStore', 'appProviders') @observer
class MyMessages extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const profile = this.props.appStore.authStore.profile;

    talkjs.init();

    Talk.ready.then(() => {
        var me = new Talk.User({
            id: profile.dorbel_user_id,
            name: profile.first_name,
            email: profile.email,
            photoUrl: profile.picture,
            welcomeMessage: "Hey there! Love to chat :-)"
        });
        var other = new Talk.User({
            id: "12345",
            name: "George Looney",
            email: "george@looney.net",
            photoUrl: "https://talkjs.com/docs/img/george.jpg",
            welcomeMessage: "Hey there! How are you? :-)"
        });
        window.talkSession = new Talk.Session({
            appId: "taEQQ8AS",
            publishableKey: "pk_test_7L5d4GmL6LAj26pjg31VZVY",
            me: me
        });

        //var conversation = talkSession.getOrStartConversation(other);
        //var inbox = talkSession.createInbox({selected: conversation});
        var inbox = talkSession.createInbox();
        inbox.mount(document.getElementById("talkjs-inbox-container"));
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
