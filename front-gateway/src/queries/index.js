import { gql, graphql } from 'react-apollo';

module.exports = {
  graphql,
  getCities: gql(require('./getCities')),
  getNeighborhoods: gql(require('./getNeighborhoods'))
};
