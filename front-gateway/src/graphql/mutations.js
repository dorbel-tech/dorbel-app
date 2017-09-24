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
  `,
  toggleFilterNotifications: gql`
    mutation toggleFilter($email_notification: Boolean!) {
        toggleFiltersEmail(email_notification: $email_notification)
    }
  `
};


