'use strict';
import { render } from 'react-dom';

import shared from '~/app.shared';
const entrypoint = shared.injectStores(window.__INITIAL_STATE__);
render(entrypoint.app, document.getElementById('root'));
