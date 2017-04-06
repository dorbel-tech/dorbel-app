/***
 * Shared dashboard
 */
'use strict';
import React from 'react';
import MyProperties from './MyProperties';
import MyLikes from './MyLikes';
import MyProfile from './Profile/Profile';

const MENU_ITEMS = [
  { navTo: 'my-properties', menuText: 'הנכסים שלי', faIconClassName: 'fa-home', component: <MyProperties /> },
  { navTo: 'my-likes', menuText: 'דירות שאהבתי', faIconClassName: 'fa-heart', component: <MyLikes /> },
  { navTo: 'my-profile', menuText: 'הפרופיל שלי', faIconClassName: 'fa-user', component: <MyProfile /> }
];

module.exports = {
  MENU_ITEMS
};
