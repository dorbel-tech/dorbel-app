'use stric';
const common = require('../common');

module.exports = {
  url: function(propertyId, tab){
    return common.getBaseUrl() + '/dashboard/my-properties/' + propertyId + '/' + (tab || '');
  },
  sections: {
    propertyActions: {
      selector: '.property-actions-wrapper',
      elements: {
        propertyRefresh: {
          selector: '.property-refresh-button'
        }
      }
    },
    propertyTitle: {
      selector: '.property-title'
    },
    listingStatusSelector: {
      selector: '.listing-status-container',
      elements: {
        listingMenuStatusDropdownToggle: {
          selector: '.dropdown-toggle'
        },
        listingMenuStatusSelector_listed: {
          selector: '.dropdown-menu #listed'
        }
      }
    }
  },
  commands: [{
    navigateToPropertyPage: function(url) {
      return this
        .navigate(url)
        .waitForElementVisible('body');
    },
    changeListingStatus: function(status) {
      return this.section.listingStatusSelector
        .click('@listingMenuStatusDropdownToggle')
        .click('@listingMenuStatusSelector_' + status);
    },
    refreshProperty: function() {
      return this.section.propertyActions
        .click('@propertyRefresh');
    }
  }]
};
