import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      <div className="unread-messages-notifier">{unreadMessagesCount > 9 ? 9 : unreadMessagesCount}</div> : null;
  }
}

UnreadMessagesNotifier.wrappedComponent.propTypes = {
  appProviders: PropTypes.object,
  appStore: PropTypes.object
};
