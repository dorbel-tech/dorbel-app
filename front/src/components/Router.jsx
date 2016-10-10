import React from 'react';
import { Router, browserHistory } from 'react-router';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import routes from '~/routes';
import ApartmentStore from '~/stores/ApartmentStore';

const apartmentStore = new ApartmentStore(window.__INITIAL_STATE__);

render((
  <Provider apartmentStore={apartmentStore}>
    <Router routes={routes} history={browserHistory} />
  </Provider>
), document.getElementById('root'));




