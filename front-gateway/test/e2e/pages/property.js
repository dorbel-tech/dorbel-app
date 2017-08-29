'use stric';
const common = require('../common');

module.exports = {
  url: function(listingId, tab){
    return common.getBaseUrl() + '/dashboard/my-properties/' + listingId + '/' + (tab || '');
  },
  sections: {
    propertyTitle: {
      selector: '.property-title'
    },
    // Selector for listing status container on desktop only
    listingStatusSelector: {
      selector: '.property-status-desktop > .dropdown.btn-group',
      elements: {
        listingMenuStatusDropdownToggle: {
          selector: '.dropdown-toggle'
        },
        listingMenuStatusSelector_listed: {
          selector: '.dropdown-menu #listed'
        }
      }
    },
    oheTab: {
      selector: '.listing-events-container',
      elements: {
        addFirstOHEButton: {
          selector: '.listing-events-empty-add-button'
        },
        futureOHECard: {
          selector: '.listing-future-events>.ohe-card-row'
        }
      }
    },
    oheModal: {
      selector: '.modal-dialog',
      elements: {
        okButton: {
          selector: '.btn-success'
        },
        closeButton: {
          selector: 'close'
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
    addFirstOHE: function() {
      this.section.oheTab.click('@addFirstOHEButton');
      return this.section.oheModal
        .click('@okButton')
        .click('@closeButton');
    }
  }]
};
