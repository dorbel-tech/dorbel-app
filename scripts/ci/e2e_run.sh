#!/bin/bash
set -x # Print all commands to terminal as executed.

cd front-gateway && yarn install
FRONT_GATEWAY_URL=$1 yarn run test:e2e:browserstack
