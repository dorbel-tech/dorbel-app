import React, { Component } from 'react';
import { inject } from 'mobx-react';
import NotificationSystem from 'react-notification-system';

@inject('appProviders')
class Notifications extends Component {

  componentDidMount() {
    // initiating the provider outside its constructor...
    this.props.appProviders.notificationProvider.notificationSystem = this.refs.notificationSystem;
  }

  render() {
    return (
      <NotificationSystem ref="notificationSystem" />
    );
  }
}

Notifications.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object
};

export default Notifications;
