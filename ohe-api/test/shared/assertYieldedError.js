// this is needed in order to test errors coming from generator functions
const __ = require('hamjest');

module.exports = function* match(funcToTest, errorAssertion) {
  try {
    yield funcToTest();
    __.assertThat('code', __.is('not reached'));
  }
  catch (error) {
    __.assertThat(error, errorAssertion);
  }
};
