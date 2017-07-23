/***
 * Shared dashboard
 */
'use strict';
import React from 'react';

import MyLikes from './MyLikes';
import MyMessages from './MyMessages';
import MyProfile from './MyProfile';
import MyProperties from './MyProperties';
import UnreadMessagesNotifier from '~/components/Messaging/UnreadMessagesNotifier';
import MyDocuments from './MyDocuments';

const MENU_ITEMS = [
  { navTo: 'my-properties', menuText: 'הנכסים שלי', faIconClassName: 'fa-home', component: <MyProperties /> },
  { navTo: 'my-documents', menuText: 'המסמכים שלי', faIconClassName: 'fa-paperclip', component: <MyDocuments /> },
  { navTo: 'my-messages', menuText: <span>הודעות<UnreadMessagesNotifier /></span>, faIconClassName: 'fa-comments', component: <MyMessages />, hide: !process.env.TALKJS_PUBLISHABLE_KEY },
  { navTo: 'my-likes', menuText: 'דירות שאהבתי', faIconClassName: 'fa-heart', component: <MyLikes /> },
  { navTo: 'my-profile', menuText: 'פרופיל והגדרות', faIconClassName: 'fa-user', component: <MyProfile /> }
].filter(item => !item.hide);

module.exports = {
  MENU_ITEMS
};
