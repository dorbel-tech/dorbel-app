#!/bin/bash
set -x # Print all commands to terminal as executed.
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately.

docker-compose exec ohe-api yarn run lint
docker-compose exec ohe-api bash -c "yarn run wait && yarn run test:seed"
docker-compose exec ohe-api yarn run test
docker-compose exec ohe-api cp -v ./test/coverage/coverage-final.json /shared/
docker-compose exec ohe-api yarn run test:integration
