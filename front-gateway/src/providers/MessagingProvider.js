'use strict';

class MessagingProvider {
  constructor(profile) {
    this.profile = profile;

    // will only work on client side
    global.window && this.init();
  }

  init() {
    this.talkjs(global.window, document, []);

    Talk.ready.then(() => {
      const me = new Talk.User({
        id: this.profile.dorbel_user_id,
        name: this.profile.first_name,
        email: this.profile.email,
        photoUrl: this.profile.picture,
        welcomeMessage: 'Hey there! Love to chat :-)'
      });

      this.talkSession = new Talk.Session({
        appId: 'taEQQ8AS',
        publishableKey: 'pk_test_7L5d4GmL6LAj26pjg31VZVY',
        me: me
      });
    });
  }

  talkjs(t,a,l,k,j,s) {
    s=a.createElement('script');s.async=1;s.src='https://cdn.talkjs.com/talk.js';a.getElementsByTagName('head')[0].appendChild(s);k=t.Promise;
    t.Talk={ready:{then:function(f){if(k){return new k(function(r,e){l.push([f,r,e]);});}l.push([f]);},catch:function(){return k&&new k();},c:l}};
  }

  getOrStartConversation(withUserId, options) {
    const withUser = new Talk.User({id: withUserId});

    return this.talkSession.getOrStartConversation(withUser, options || {});
  }

  getTalkSession() {
    return this.talkSession;
  }
}

module.exports = MessagingProvider;
