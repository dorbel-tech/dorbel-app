#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RET_CODE = 0
function runTests() {
  yarn run wait && mocha --timeout 10000 --compilers js:babel-register test/shared/before-tests.js test/integration/**/*.spec.js;
  RET_CODE = $?
}

runTests
node "$DIR/dbCleaner.js"
exit $RET_CODE