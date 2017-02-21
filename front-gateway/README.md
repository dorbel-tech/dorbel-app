# dorbel front end application

## Install
``yarn install``
Also install chromedirver from https://chromedriver.storage.googleapis.com/index.html?path=2.26/ and place it under bin folder

## Running in Developemt
You'll need to run two terminals
1. One for the hot-reload server - ``yarn run build:dev``
2. One for the main application - ``yarn run start:dev``
3. If you have ``tmux`` installed you can run ``./scripts/run`` to run both commands in a split screen

## Running in production
1. ``yarn run build``
2. ``yarn start``

## Running the unit tests
1. ``yarn test:unit``
2. You can now check out the [coverage report](test/coverage/lcov-report/index.html)

## Running the e2e tests
You'll need to run two terminals
1. One for the the complete environment (project root) - ``yarn start``
2. One for the test console (under front-gateway folder) - ``yarn run test:e2e``

We are using nightwatch custom commands: https://github.com/maxgalbu/nightwatch-custom-commands-assertions

To run tests in Browserstack - https://www.browserstack.com/automate/nightwatch-integration:
1. Running on public URL, specify it in FRONT_GATEWAY_URL env var and run - ``yarn run test:e2e:browserstack``
2. Running on local URL, run - ``yarn run test:e2e:browserstack:local``
