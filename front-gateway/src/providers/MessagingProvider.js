'use strict';

class MessagingProvider {
  constructor(authStore) {
    this.authStore = authStore;

    this.initTalkJS();
  }

  initTalkJS() {
    // will only work on client side
    global.window &&
      this.talkjs(global.window, document, []) &&
      this.initTalkSession();
  }

  initTalkSession() {
    if (this.talkSession || !this.authStore.isLoggedIn) {
      return false;
    }

    // will only work on client side
    global.window && global.window.Talk.ready.then(() => {
      const me = new global.window.Talk.User({
        id: this.authStore.profile.dorbel_user_id,
        name: this.authStore.profile.first_name,
        email: this.authStore.profile.email,
        photoUrl: this.authStore.profile.picture,
        configuration: 'general',
        welcomeMessage: 'Hey there! Love to chat :-)'
      });

      this.talkSession = new global.window.Talk.Session({
        appId: 'taEQQ8AS',
        publishableKey: 'pk_test_7L5d4GmL6LAj26pjg31VZVY',
        me: me
      });
    });

    return true;
  }

  talkjs(t,a,l,k,j,s) {
    s=a.createElement('script');s.async=1;s.src='https://cdn.talkjs.com/talk.js';a.getElementsByTagName('head')[0].appendChild(s);k=t.Promise;
    t.Talk={ready:{then:function(f){if(k){return new k(function(r,e){l.push([f,r,e]);});}l.push([f]);},catch:function(){return k&&new k();},c:l}};
  }

  getOrStartConversation(withUserObj, options) {
    if (this.initTalkSession()) {
      global.window.Talk.ready.then(() => {
        const withUser = new global.window.Talk.User(withUserObj);

        return this.talkSession.getOrStartConversation(withUser, options || {});
      });
    } else {
      // TODO: Handle edge case by throwing an exception?
    }
  }
}

module.exports = MessagingProvider;
