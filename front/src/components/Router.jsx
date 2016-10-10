import { Router, browserHistory } from 'react-router';
import React from 'react';
import { render } from 'react-dom';
import routes from '../routes';

render((
  <Router routes={routes} history={browserHistory} />
), document.getElementById('root'));




