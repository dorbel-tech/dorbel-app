'use strict';
const co = require('co');
const _ = require('lodash');

// This will wrap all the generator functions in the resolvers object with co
// That's because graphql-tools doesn't support generators and it expects Promises
// And co is what transforms generators to Promises
function applyCoToGeneratorResolvers(resolvers) {
  const fixedResolvers = {};

  Object.keys(resolvers).forEach(resolverName => {
    const resolver = resolvers[resolverName];
    if (!_.isFunction(resolver)) {
      fixedResolvers[resolverName] = applyCoToGeneratorResolvers(resolver);
    } else if ('GeneratorFunction' === resolver.constructor.name || 'GeneratorFunction' === resolver.constructor.displayName) {
      fixedResolvers[resolverName] = co.wrap(resolver);
    } else {
      fixedResolvers[resolverName] = resolver;
    }
  });

  return fixedResolvers;
}

module.exports = {
  applyCoToGeneratorResolvers
};
