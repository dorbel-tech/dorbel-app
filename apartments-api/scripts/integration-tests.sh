#!/usr/bin/env bash
EXIT_CODE=0

function runTests() {
  yarn run wait && mocha --timeout 10000 --compilers js:babel-register test/shared/before-tests.js test/integration/**/*.spec.js;
  EXIT_CODE=$? # Keep the mocha exit code in order to return it at the end
}

runTests
yarn db:clean

exit ${EXIT_CODE}
