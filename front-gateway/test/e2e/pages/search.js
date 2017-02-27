var baseUrl = require('./helper').url();

module.exports = {
  url: function(){
    return baseUrl + '/apartments';
  },
  sections: {
    searchFilter: {
      selector: '.apartments-filter-wrapper',
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
