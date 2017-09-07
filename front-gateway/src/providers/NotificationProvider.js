import autobind from 'react-autobind';
import _ from 'lodash';

export default class NotificationProvider {
  constructor() {
    autobind(this);
  }

  notificationSystem;  // Initiated outside contsrtuctor through the Notification component
  // 3rd party module does't separate component from business logic...

  error(resp, options = {}) {
    let message = 'אופס, משהו השתבש. נסו שנית מאוחר יותר.';
    if(_.isString(resp)) {
      message = resp;
    } 
    else if (resp.response && resp.response.data && _.isString(resp.response.data)) {
      message = resp.response.data;
    }

    const notification = this.createNotificationObj('error', message, options);
    this.notificationSystem.addNotification(notification);
  }

  success(message, options = {}) {
    const notification = this.createNotificationObj('success', message, options);
    this.notificationSystem.addNotification(notification);
  }

  createNotificationObj(level, message, options) {
    return {
      title: '',
      message: message,
      level: level,
      dismissible: options.dismissible || false,
      autoDismiss: options.autoDismiss || 5,
      position: options.position || 'bl'
    };
  }
}
