# dorbel notifications service 
> Worker to process notifications messages from SQS and dispatch using Email or SMS.

## Scripts
- Install using ``yarn install``
- Start using ``yarn start``
- Start development using ``yarn run start:dev``
  - will restart server when files are changed.
- Run tests using ``yarn test`` (currently runs integration tests)

## Server
- Uses [koa](http://koajs.com/) for http framework
- API is defined in a swagger document - ``src/server/swagger.json``
- Controllers are in ``src/controllers``
- Mapping from routes to controllers is according to the first ``tag`` value of each path in the swagger doc
- See [fleek-router](https://github.com/fleekjs/fleek-router) for details
