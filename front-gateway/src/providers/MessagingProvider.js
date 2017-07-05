'use strict';

import _ from 'lodash';
import utils from './utils';

const TALKJS_USER_OBJ_EXTRA = {configuration: 'general'};

// TalkJS wrapper provider, see docs: https://talkjs.com/docs/index.html
class MessagingProvider {
  constructor(authStore) {
    this.authStore = authStore;

    // will only work on client side
    global.window &&
      this.talkjs(global.window, document, []) &&
      this.initTalkSession();
  }

  // If active user is logged in and an active TalkJS user was not
  // already created, create an active TalkJS user using the logged in user profile.
  initTalkUser() {
    if (!this.talkUser && this.authStore.isLoggedIn) {
      this.talkUser = new global.window.Talk.User(_.defaults({
        id: this.authStore.profile.dorbel_user_id,
        name: this.authStore.profile.first_name,
        email: this.authStore.profile.email,
        photoUrl: this.authStore.profile.picture
      }, TALKJS_USER_OBJ_EXTRA));

      return true;
    }

    return false;
  }

  // If an active TalkJS user was created, create a new TalkJS session.
  initTalkSession() {
    if (!this.initTalkUser()) {
      return false;
    }

    this.talkSession = new global.window.Talk.Session({
      appId: global.window.dorbelConfig.TALKJS_APP_ID,
      publishableKey: global.window.dorbelConfig.TALKJS_PUBLISHABLE_KEY,
      me: this.talkUser
    });

    return true;
  }

  // TalkJS loader script, which creates a global.window.Talk object.
  talkjs(t,a,l,k,j,s) {
    s=a.createElement('script');s.async=1;s.src='https://cdn.talkjs.com/talk.js';a.getElementsByTagName('head')[0].appendChild(s);k=t.Promise;
    t.Talk={ready:{then:function(f){if(k){return new k(function(r,e){l.push([f,r,e]);});}l.push([f]);},catch:function(){return k&&new k();},c:l}};
  }

  // Create a TalkJS user and start a conversation between the active
  // TalkJS user and the newly created TalkJS user using a new TalkJS session.
  getOrStartConversation(withUserObj, options) {
    return global.window.Talk.ready.then(() => {
      if (this.initTalkSession() && this.talkUser.id !== withUserObj.id) {
        const withUser = new global.window.Talk.User(_.defaults(withUserObj, TALKJS_USER_OBJ_EXTRA));

        const conversation = this.talkSession.getOrStartConversation(withUser, options || {});
        const popup = this.talkSession.createPopup(conversation);
        popup.mount();

        utils.hideIntercom(true);

        return popup;
      } else {
        // TODO: Handle edge case by throwing an exception?
      }
    });
  }

  // Create an inbox for the active TalkJS user using a new TalkJS session.
  createInbox(element) {
    return global.window.Talk.ready.then(() => {
      if (this.initTalkSession()) {
        const inbox = this.talkSession.createInbox();
        inbox.mount(element);
      } else {
        // TODO: Handle edge case by throwing an exception?
      }
    });
  }
}

module.exports = MessagingProvider;
