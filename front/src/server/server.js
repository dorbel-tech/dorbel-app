'use strict';
require('babel-core/register');
const koa = require('koa');
const config = require('../config');
const logger = require('dorbel-shared').logger.getLogger(module);
const koaStatic = require('koa-static');
const path = require('path');
const render = require('koa-ejs');
const reactDom = require('react-dom/server');
const reactRouter = require('react-router');

const RouterContext = require('../client/RouterContext');
const App = require('../client/App');

const routes = {
  path: '/',
  component: App
};

const app = koa();
const port = config.get('PORT');

app.use(koaStatic(config.dir.public));

render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'ejs'
});

app.use(function* () {
  let reactString;

  reactRouter.match({ routes, location: this.url },
    (error, redirectLocation, renderProps) => {
      if (error) {
        this.throw(error.message, 500);
      } else if (redirectLocation) {
        this.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        reactString = reactDom.renderToString(RouterContext(renderProps));
        this.render('index', { reactString });
      } else {
        this.throw('Not Found', 404);
      }
    }
  );
});


app.listen(port, () => {
  logger.info({ port, env: process.env.NODE_ENV }, '✅  Server is listening');
});
