'use stric';
const common = require('../common');

module.exports = {
  url: function(listingId){
    return common.getBaseUrl() + '/apartments/' + listingId;
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
    },
    followContainer: {
      selector: '.ohe-list-follow-container',
      elements: {
        followBtn: {
          selector: '.follow-action'
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
    },
    clickFollowButton: function() {
      return this.section.followContainer.click('@followBtn');
    }
  }]
};
