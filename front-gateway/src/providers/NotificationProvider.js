export default class NotificationProvider {

  notificationSystem;  // Initiated outside contsrtuctor through the Notification component
                       // 3rd party module does't separate component from business logic...

  error(resp, fallbackErrorData, options = {}) {

    const notificationData = this.getNotificationDataByResponse(resp) || fallbackErrorData;

    this.notificationSystem.addNotification({
      title: notificationData.title || 'Error',
      message: notificationData.message,
      level: options.type || 'error',
      dismissible: options.dismissible || false,
      autoDismiss: options.autoDismiss || 5,
      position: options.position || 'tl'
    });
  }

  // TODO: add product texts once ready 
  getNotificationDataByResponse(resp) {
    const error = resp.response.data;
    switch (error.error_code) {
      case 101:
        return {
          message: error.message,
          title: 'Error'
        };
      case 102:
        return {
          message: error.message,
          title: 'Error'
        };
      case 103:
        return {
          message: error.message,
          title: 'Error'
        };
      case 104:
        return {
          message: error.message,
          title: 'Error'
        };
      case 105:
        return {
          message: error.message,
          title: 'Error'
        };
      case 201:
        return {
          message: error.message,
          title: 'Error'
        };
      case 202:
        return {
          message: error.message,
          title: 'Error'
        };

      default:
        return undefined;
    }
  }
}
