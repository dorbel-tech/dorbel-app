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
      selector: '.listing-status-container',
      elements: {
        listingMenuStatusDropdownToggle: {
          selector: '.dropdown-toggle'
        },
        listingMenuStatusSelector_listed: {
          selector: '.dropdown-menu #listed'
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
          selector: 'a:first-child .ohe-text'
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
          selector: 'button.btn-primary'
        },
        cancel: {
          selector: 'button.btn-danger'
        }
      }
    },
    followContainer: {
      selector: '.owner-container',
      elements: {
        followBtn: {
          selector: '.follow-action'
        }
      }
    },
    followModal: {
      selector: '.modal-dialog',
      elements: {
        submit: {
          selector: 'button.btn-success'
        },
        ok: {
          selector: 'button.btn-success'
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
    },
    clickFirstOhe: function() {
      return this.section.oheList.click('@firstEvent');
    },
    fillOheRegisterUserDetailsAndSubmit: function() {
      return this.section.oheModal
        .click('@submit')
        .waitForElementVisible('@ok')
        .click('@ok');
    },
    oheUnRegisterUser: function() {
      return this.section.oheModal.click('@cancel');
    },
    clickFollowOheButton: function() {
      return this.section.followContainer.click('@followBtn');
    },
    followUserToOheUpdates: function() {
      return this.section.followModal
        .click('@submit')
        .waitForElementVisible('@ok')
        .click('@ok');
    },
    unFollowUserToOheUpdates: function() {
      return this.section.followModal.click('@ok');
    }
  }]
};
