#!/bin/bash
set -x # Print all commands to terminal as executed.
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately.

docker-compose exec notifications-service yarn run lint
docker-compose exec notifications-service yarn run test
docker-compose exec notifications-service cp -v ./test/coverage/coverage-final.json /shared/
docker-compose exec notifications-service yarn run test:integration