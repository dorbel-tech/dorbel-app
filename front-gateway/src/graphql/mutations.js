'use strict';
import fieldSets from './fieldSets';
import { gql } from 'react-apollo';

module.exports = {
  saveFilter: gql`
    mutation saveFilter($filter: FilterInput!) {
      upsertFilter(filter: $filter) {
        ${ fieldSets.filterFields.join(', ') }
      }
    }
  `
}


