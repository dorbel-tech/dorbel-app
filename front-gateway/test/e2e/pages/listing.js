'use stric';
const common = require('../common');

module.exports = {
  url: function(listingId){
    return common.getBaseUrl() + '/properties/' + listingId;
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
      selector: '.listing-interested-box-button-container',
      elements: {
        button: {
          selector: '.like-button'
        },
        text: {
          selector: '.like-button-text'
        }
      }
    },
    profileEditModal: {
      selector: '.modal-dialog',
      elements: {
        title: {
          selector: '.modal-header > h4'
        },
        age: {
          selector: 'input[name="tenant_profile.age"]'
        },
        location: {
          selector: 'input[name="tenant_profile.location"]'
        },
        workplace: {
          selector: 'input[name="tenant_profile.work_place"]'
        },
        position: {
          selector: 'input[name="tenant_profile.position"]'
        },
        about: {
          selector: 'textarea[name="tenant_profile.about_you"]'
        },
        sendButton: {
          selector: '.tenant-profile-edit-button'
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
    fillAndSubmitProfile: function() {
      const randomProfile = common.getRandomProfile();
      this.section.profileEditModal
        .waitForElementVisible('@workplace')
        .setValue('@age', randomProfile.age)
        .setValue('@location', randomProfile.location)
        .setValue('@workplace', randomProfile.workplace)
        .setValue('@position', randomProfile.position)
        .setValue('@about', randomProfile.about);
      return this.section.profileEditModal.click('@sendButton');
    },
    validateSuccessNotificationVisible: function() {
      this.waitForElementVisible('@notification');
      return this;
    }
  }]
};
