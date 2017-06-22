'use stric';
const common = require('../common');

module.exports = {
  url: function(){
    return common.getBaseUrl() + '/search';
  },
  sections: {
    searchFilter: {
      selector: '.search-filter-wrapper',
      elements: {
        city: {
          selector: '#cityDropdown'
        }
      }
    }
  },
  commands: [{
    selectCity: function() {
      return this.section.searchFilter.getValue('@city');
    },
  }]
};
