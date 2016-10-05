module.exports = {
  config: require('./config'),
  logger: require('./logger'),
  middleware: {
    requestLogger: require('./koa-middleware/request-logger')
  }
};
