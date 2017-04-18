import autobind from 'react-autobind';

export default class NotificationProvider {
  constructor() {
    autobind(this);
  }

  notificationSystem;  // Initiated outside contsrtuctor through the Notification component
  // 3rd party module does't separate component from business logic...

  error(resp, options = {}) {

    const message = resp.response ? resp.response.data : 'אופס, משהו השתבש. נסו שנית מאוחר יותר.';

    this.notificationSystem.addNotification({
      title: '',
      message: message,
      level: 'error',
      dismissible: options.dismissible || false,
      autoDismiss: options.autoDismiss || 5,
      position: options.position || 'bl'
    });
  }

  success(message) {
    this.notificationSystem.addNotification({
      title: '',
      message: message,
      level: 'success',
      dismissible: false,
      autoDismiss: 5,
      position: 'bl'
    });
  }
}
