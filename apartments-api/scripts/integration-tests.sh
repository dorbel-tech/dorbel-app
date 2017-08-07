#!/usr/bin/env bash
EXIT_CODE=0

function runTests() {
  yarn run wait && mocha --timeout 10000 test/shared/before-tests.js test/integration/**/*.spec.js;
  EXIT_CODE=$? # Keep the mocha exit code in order to return it at the end
}

yarn db:clean
runTests

exit ${EXIT_CODE}
