'use stric';
const baseUrl = require('./home').url();

module.exports = {
  url: function(){
    return baseUrl + '/apartments';
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
