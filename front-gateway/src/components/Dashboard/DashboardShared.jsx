/***
 * Shared dashboard
 */
'use strict';
import React from 'react';
import MyProperties from '~/components/Dashboard/MyProperties';
import MyLikes from '~/components/Dashboard/MyLikes';
import ListingStats from '~/components/Dashboard/MyProperties/ListingStats';

const MENU_ITEMS = [
  { navTo: 'my-properties', menuText: 'הנכסים שלי', faIconClassName: 'fa-home', component: <MyProperties/> },
  { navTo: 'my-likes', menuText: 'דירות שאהבתי', faIconClassName: 'fa-heart', component: <MyLikes/>},
  { navTo: 'my-stats', menuText: 'סטטיסטיקה', faIconClassName: 'fa-tats', component: <ListingStats listingId={1}/>} // TODO: Remove
];

module.exports = {
  MENU_ITEMS
};
