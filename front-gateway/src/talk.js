'use strict';

function talkjs (t,a,l,k,j,s) {
  s=a.createElement('script');s.async=1;s.src='https://cdn.talkjs.com/talk.js';a.getElementsByTagName('head')[0].appendChild(s);k=t.Promise;
  t.Talk={ready:{then:function(f){if(k){return new k(function(r,e){l.push([f,r,e]);});}l.push([f]);},catch:function(){return k&&new k();},c:l}};
}

function init() {
  talkjs(window,document,[]);
}

module.exports = {
  init
};
