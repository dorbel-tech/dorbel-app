'use strict';

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
      this.talkUser = new global.window.Talk.User({
        id: this.authStore.profile.dorbel_user_id,
        name: this.authStore.profile.first_name,
        email: this.authStore.profile.email,
        photoUrl: this.authStore.profile.picture,
        configuration: 'general',
        welcomeMessage: 'הי, אשמח לשוחח :)'
      });

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
      appId: window.dorbelConfig.TALKJS_APP_ID,
      publishableKey: window.dorbelConfig.TALKJS_PUBLISHABLE_KEY,
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
    if (this.initTalkSession()) {
      const withUser = new global.window.Talk.User(withUserObj);

      return this.talkSession.getOrStartConversation(withUser, options || {});
    } else {
      // TODO: Handle edge case by throwing an exception?
    }
  }
}

module.exports = MessagingProvider;
