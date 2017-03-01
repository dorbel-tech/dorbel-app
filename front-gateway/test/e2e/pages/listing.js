const util = require('util');
const baseUrl = require('./home').url();

module.exports = {
  url: function(listingId){
    return baseUrl + '/apartments/' + listingId;
  },
  sections: {
    listingTitle: {
      selector: '.apt-headline-container'
    },
    landlordControls: {
      selector: '.listing-menu-tabs',
      elements: {
        listingMenuStatusDropdownToggle: {
          selector: '.listing-menu-status-selector .dropdown-toggle'
        },
        listingMenuStatusSelector_listed: {
          selector: '.listing-menu-status-selector .dropdown-menu #listed'
        }
      }
    }
  },
  commands: [{
    navigateToListingPage: function(url) {
      return this
        .navigate(url)
        .waitForElementVisible('body');
    },
    changeListingStatus: function(status) {
      return this.section.landlordControls
        .click('@listingMenuStatusDropdownToggle')
        .click('@listingMenuStatusSelector_' + status);
    }
  }]
};
