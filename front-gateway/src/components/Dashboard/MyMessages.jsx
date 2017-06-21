import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { setIntercomStyle } from '~/providers/utils';

import './MyMessages.scss';

@inject('appProviders') @observer
class MyMessages extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { messagingProvider } = this.props.appProviders;

    Talk.ready.then(() => {
      var inbox = messagingProvider.talkSession.createInbox();
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
  appProviders: React.PropTypes.object.isRequired
};

export default MyMessages;
