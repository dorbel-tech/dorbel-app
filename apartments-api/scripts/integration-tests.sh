#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
EXIT_CODE=0

function runTests() {
  yarn run wait && mocha --timeout 10000 --compilers js:babel-register test/shared/before-tests.js test/integration/**/*.spec.js;
  EXIT_CODE=$? # Keep the exit code
}

runTests
node "$DIR/dbCleaner.js" # Clean the DB

exit ${RET_CODE}