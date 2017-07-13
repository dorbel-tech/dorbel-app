'use stric';
const common = require('../common');

module.exports = {
  url: function(listingId, tab){
    return common.getBaseUrl() + '/dashboard/my-properties/' + listingId + '/' + (tab || '');
  },
  sections: {
    propertyActions: {
      selector: '.property-actions-wrapper',
      elements: {
        propertyRefresh: {
          selector: '.fa-refresh.property-action-button'
        }
      }
    },
    propertyTitle: {
      selector: '.property-title'
    },
    // Selector for listing status container on desktop only
    listingStatusSelector: {
      selector: '.property-image-container > .dropdown.btn-group',
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
