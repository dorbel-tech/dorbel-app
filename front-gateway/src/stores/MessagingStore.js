'use strict';
import { observable } from 'mobx';

export default class MessagingStore {
  @observable unreadMessagesCount;
  
  constructor() {
    this.unreadMessagesCount = 0;
  }

  setUnreadMessagesCount(count) {
    this.unreadMessagesCount = count;
  }
}
