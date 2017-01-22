let nightwatch_config = {
  src_folders : ['test/e2e'],
  output_folder : 'test/e2e/reports',
  page_objects_path : 'test/e2e/pages',

  selenium : {
    start_process : false,
    host : 'hub-cloud.browserstack.com',
    port : 80
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        'build': 'nightwatch-browserstack',
        'browserstack.user': process.env.BROWSERSTACK_USER,
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        'os': 'Windows',
        'os_version': '10',
        'browser': 'Chrome',
        'browser_version': '55.0',
        'resolution': '1280x1024',
        'browserstack.debug': true,
        'browserstack.local': true,
        'browserstack.localIdentifier': process.env.NODE_ENV
      }
    }
  }
};

// Code to copy seleniumhost/port into test settings
for(var i in nightwatch_config.test_settings){
  var config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}

module.exports = nightwatch_config;
