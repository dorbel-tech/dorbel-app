'use stric';
const common = require('../common');

module.exports = {
  url: function(){
    return common.getBaseUrl() + '/search';
  },
  sections: {
    searchFilter: {
      selector: '.filter-wrapper',
      elements: {
        visibleRow: {selector: '.row'},
        moreFilters: {
          selector: '.filter-trigger-more'
        }
      }
    },
    body: {
      selector: 'body',
      elements: {
        listingStatus: {
          selector: '.filter-show-listing-status'
        }
      }
    }
  },
  commands: [{
    selectMoreFilters: function() {
      this.section.searchFilter.click('@visibleRow');
      this.section.searchFilter.click('@moreFilters');
      return this;
    },
  }]
};
