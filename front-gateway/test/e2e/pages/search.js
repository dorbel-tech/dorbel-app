var baseUrl = require('./helper').url();

module.exports = {
  url: function(){
    return baseUrl + '/apartments';
  },
  elements: {
    city: {
      selector: '.header-navbar-profile-login-text'
    }
  },
  commands: [{  
    selectCity: function(browser) {
      browser.resizeWindow(1280, 1024);
    },
  }]
};
