'use strict';
import fieldSets from './fieldSets';
import { gql } from 'react-apollo';

module.exports = {
  getFilters: gql`
    query getFilters {
      filters { ${fieldSets.filterFields.join(', ')} }
    }
  `
}
