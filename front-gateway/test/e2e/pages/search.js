var helper;

module.exports = {
  url: function(){    
    return helper.url() + '/apartments';
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
