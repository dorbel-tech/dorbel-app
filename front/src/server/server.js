'use strict';
import koa from 'koa';
import koaStatic from 'koa-static';
import compress from 'koa-compress';
import koa_ejs from 'koa-ejs';
import config from '../config';
import shared from 'dorbel-shared';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../routes';

const app = koa();
const logger = shared.logger.getLogger(module);
const port = config.get('PORT');

app.use(compress());
app.use(shared.middleware.requestLogger());
app.use(koaStatic(config.dir.public));

koa_ejs(app, {
  root: __dirname,
  layout: false,
  viewExt: 'ejs'
});

app.use(function* () {
  let appHtml;

  match({ routes: routes, location: this.path }, (err, redirect, props) => {
    if (err) {
      this.status = 500;
      this.body = err.message;
    }
    else if (redirect) {
      this.redirect(redirect.pathname + redirect.search);
    }
    else if (props) {
      appHtml = renderToString(<RouterContext {...props}/>);
    }
    else {
      // no errors, no redirect, we just didn't match anything
      this.status = 404;
      this.body = 'Not Found';
    }
  });

  yield this.render('index', { appHtml });
});

app.listen(port, () => {
  logger.info({ port, env: process.env.NODE_ENV }, '✅  Server is listening');
});
