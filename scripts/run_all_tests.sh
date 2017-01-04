#!/bin/bash
# A script to run all services tests in Docker containers, just like in CI.

docker-compose run apartments-api yarn run lint &&
docker-compose run apartments-api yarn run test &&
docker-compose run apartments-api yarn run test:integration &&
docker-compose run ohe-api yarn run lint &&
docker-compose run ohe-api yarn run test &&
docker-compose run ohe-api yarn run test:integration &&
docker-compose run notifications-service yarn run lint &&
docker-compose run notifications-service yarn run test &&
docker-compose run notifications-service yarn run test:integration &&
docker-compose run front-gateway  yarn run lint &&
docker-compose run front-gateway  yarn run test
