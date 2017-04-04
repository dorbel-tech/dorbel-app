/***
 * Shared dashboard
 */
'use strict';
import React from 'react';
import MyProperties from '~/components/Dashboard/MyProperties';
import MyLikes from '~/components/Dashboard/MyLikes';

const MENU_ITEMS = [
  { navTo: 'my-properties', menuText: 'הנכסים שלי', faIconClassName: 'fa-home', component: <MyProperties/> },
  { navTo: 'my-likes', menuText: 'דירות שאהבתי', faIconClassName: 'fa-heart', component: <MyLikes/>},
];

module.exports = {
  MENU_ITEMS
};
