'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import routes from '~/routes';
import shared from '~/app.shared';

const entrypoint = shared.injectStores(
  <Router routes={routes} history={browserHistory} />,
  window.__INITIAL_STATE__
);

render(entrypoint.app, document.getElementById('root'));




