export default class NotificationProvider {

  notificationSystem;  // Initiated outside contsrtuctor through the Notification component
                       // 3rd party module does't separate component from business logic...

  add(title, message, options= {}) {
    this.notificationSystem.addNotification({
      title: title,
      message: message,
      level: options.type || 'error',
      dismissible: options.dismissible || false,
      autoDismiss: options.autoDismiss || 5,
      position: options.position || 'bl'
    });
  }
}
