import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { hideIntercom } from '~/providers/utils';

import './MyMessages.scss';

@inject('appProviders') @observer
class MyMessages extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { messagingProvider } = this.props.appProviders;

    messagingProvider.createInbox(document.getElementById('talkjs-inbox-container'));
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
