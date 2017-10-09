'use strict';
import { render } from 'react-dom';
import './components/sharedStyles/styles.scss';

import shared from '~/app.shared';
const entrypoint = shared.createAppEntryPoint(window.__INITIAL_STATE__);
entrypoint.router.dispatch('on', location.pathname);
render(entrypoint.app, document.getElementById('root'));
