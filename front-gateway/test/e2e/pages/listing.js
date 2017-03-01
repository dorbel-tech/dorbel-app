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
        title: {
          selector: '.modal-header > h4'
        },
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
      return this.section.oheList
        .click('@firstEvent');
    },
    fillOheRegisterUserDetailsAndSubmit: function() {
      return this.section.oheModal
        .click('@submit')
        .waitForElementVisible('@ok')
        .click('@ok');
    },
    oheUnRegisterUser: function() {
      return this.section.oheModal
        .click('@cancel');
    }    
  }]
};
