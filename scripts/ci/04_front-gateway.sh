#!/bin/bash
set -x # Print all commands to terminal as executed.
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately.

docker-compose exec front-gateway yarn run lint
docker-compose exec front-gateway yarn run test
docker-compose exec front-gateway cp -v ./test/coverage/coverage-final.json /shared/
docker-compose exec front-gateway yarn run test:integration
