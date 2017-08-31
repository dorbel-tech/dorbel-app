'use stric';
const common = require('../common');

module.exports = {
  url: function(listingId){
    return common.getBaseUrl() + '/apartments/' + listingId;
  },
  elements: {
    notification: {
      selector: '.notification-message'
    }
  },
  sections: {
    listingTitle: {
      selector: '.listing-title-container'
    },
    landlordControls: {
      selector: '.listing-header',
      elements: {
        listingToDashboard: {
          selector: '.listing-header-to-dashboard'
        }
      }
    },
    like: {
      selector: '.listing-actions-like-button-wrapper',
      elements: {
        button: {
          selector: '.like-button'
        },
        text: {
          selector: '.like-button-text'
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
    clickLikeButton: function() {
      this.section.like.waitForElementVisible('@text');
      return this.section.like.click('@button');
    },
    validateSuccessNotificationVisible: function() {
      this.waitForElementVisible('@notification');
      return this;
    }
  }]
};
