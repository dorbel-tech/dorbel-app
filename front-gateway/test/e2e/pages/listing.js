var baseUrl = require('./helper').url();

module.exports = {
  url: function(listingId){
    return baseUrl + '/apartments/' + listingId;
  },
  sections: {
    landlordControls: {
      selector: '.listing-menu-tabs',
      elements: {
        listingStaus : {
          selector: '.listing-menu-status-selector .dropdown-menu'
        }
      }
    }
  },
  commands: [{
    navigateToListingPage: function(url) {
      return this
        .navigate(url)
        .waitForElementVisible('body');
    }
  }]
};
