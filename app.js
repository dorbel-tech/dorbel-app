var koa = require('koa');
var app = module.exports = koa();

app.use(function *(){
  this.body = 'Hello web app';
});

if (!module.parent) app.listen(process.env.PORT || 3000);
