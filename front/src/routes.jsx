import { Route, IndexRoute } from 'react-router';
import React from 'react';

import App from '~/components/App';
import About from '~/components/About';
import Apartments from '~/components/Apartments';
import Apartment from '~/components/Apartment';
import Home from '~/components/Home';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/apartments" component={Apartments}>
      <Route path="/apartments/:apartmentId" component={Apartment}/>
    </Route>
    <Route path="/about" component={About}/>
  </Route>
);




