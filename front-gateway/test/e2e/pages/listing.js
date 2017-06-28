'use stric';
const common = require('../common');

module.exports = {
  url: function(listingId){
    return common.getBaseUrl() + '/apartments/' + listingId;
  },
  elements: {
    successNotification: {
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
        },
        unliked: {
          selector: '.fa fa-heart-o'
        },
        liked: {
          selector: '.fa fa-heart'
        }
      }
    },
    oheList: {
      selector: '.ohe-list',
      elements: {
        firstEvent: {
          selector: 'a:first-child'
        },
        firstEventText: {
          selector: 'a:first-child .ohe-list-item-text'
        }
      }
    },
    oheModal: {
      selector: '.modal-dialog',
      elements: {
        firstName: {
          selector: 'input[name="user.firstname"]'
        },
        email: {
          selector: 'input[name="user.email"]'
        },
        phone: {
          selector: 'input[name="user.phone"]'
        },
        submit: {
          selector: 'button.btn-success'
        },
        ok: {
          selector: '.ohe-register-modal-info-button'
        },
        cancel: {
          selector: 'button.btn-danger'
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
      this.waitForElementVisible('@successNotification');
      return this;
    },
    clickFirstOhe: function() {
      return this.section.oheList.click('@firstEvent');
    },
    fillOheRegisterUserDetailsAndSubmit: function() {
      return this.section.oheModal.click('@submit')
        .waitForElementVisible('@ok')
        .click('@ok');
    },
    oheUnRegisterUser: function() {
      return this.section.oheModal.click('@cancel');
    }
  }]
};
