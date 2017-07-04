/***
 * Shared dashboard
 */
'use strict';
import React from 'react';
import MyLikes from './MyLikes';
import MyMessages from './MyMessages';
import MyProfile from './MyProfile';
import MyProperties from './MyProperties';

const MENU_ITEMS = [
  { navTo: 'my-properties', menuText: 'הנכסים שלי', faIconClassName: 'fa-home', component: <MyProperties /> },
  { navTo: 'my-messages', menuText: 'הודעות', faIconClassName: 'fa-comments', component: <MyMessages /> },
  { navTo: 'my-likes', menuText: 'דירות שאהבתי', faIconClassName: 'fa-heart', component: <MyLikes /> },
  { navTo: 'my-profile', menuText: 'פרופיל והגדרות', faIconClassName: 'fa-user', component: <MyProfile /> }
];

module.exports = {
  MENU_ITEMS
};
