#!/bin/bash
set -x # Print all commands to terminal as executed.

cd front-gateway && yarn install
yarn run test:e2e:browserstack:local
