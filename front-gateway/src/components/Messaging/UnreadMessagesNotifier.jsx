import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './UnreadMessagesNotifier.scss';

@inject('appStore', 'appProviders') @observer
export default class UnreadMessagesNotifier extends Component {
  componentDidMount() {
    this.props.appProviders.messagingProvider.watchUnreadMessagesCount();
  }

  render() {
    const unreadMessagesCount = this.props.appStore.messagingStore.unreadMessagesCount;

    return unreadMessagesCount > 0 ?
      <div className="unread-messages-notifier">{unreadMessagesCount}</div> : null;
  }
}

UnreadMessagesNotifier.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object
};
