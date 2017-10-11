import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import NotificationSystem from 'react-notification-system';

@inject('appProviders')
class Notifications extends Component {

  componentDidMount() {
    // initiating the provider outside its constructor...
    this.props.appProviders.notificationProvider.notificationSystem = this.notificationSystem;
  }

  render() {
    return (
      <NotificationSystem ref={el => this.notificationSystem = el} />
    );
  }
}

Notifications.wrappedComponent.propTypes = {
  appProviders: PropTypes.object
};

export default Notifications;
