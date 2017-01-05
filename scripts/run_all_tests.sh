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

RED='\033[1;31m'
GREEN='\033[1;32m'
RC=$?; 

if [[[ $RC != 0 ]]; then
  printf "${RED}Some tests failed.\n"  
else
  printf "${GREEN}All tests passed.\n"
fi
