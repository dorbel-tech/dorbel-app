import autobind from 'react-autobind';

export default class NotificationProvider {
  constructor() {
    autobind(this);
  }

  notificationSystem;  // Initiated outside contsrtuctor through the Notification component
  // 3rd party module does't separate component from business logic...

  error(resp, options = {}) {

    const message = resp.response.data;

    this.notificationSystem.addNotification({
      title: 'Error',
      message: message,
      level: 'error',
      dismissible: options.dismissible || false,
      autoDismiss: options.autoDismiss || 5,
      position: options.position || 'tl'
    });
  }
}
