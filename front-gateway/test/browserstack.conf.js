require('browserstack-automate').Nightwatch();

let nightwatch_config = {
  src_folders : ['test/e2e/suites'],
  output_folder : 'test/e2e/reports',
  page_objects_path : 'test/e2e/pages',
  globals_path : 'test/e2e_test_globals.js',
  custom_commands_path : 'node_modules/nightwatch-custom-commands-assertions/js/commands',
  custom_assertions_path : 'node_modules/nightwatch-custom-commands-assertions/js/assertions',

  selenium : {
    start_process : false,
    host : 'hub-cloud.browserstack.com',
    port : 80
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        project: 'dorbel-front-gateway',
        platform: 'Mac',
        browser: 'Chrome',
        browser_version: 55,
        resolution: '1280x1024',
        // 'browserstack.debug': true
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
