#!/bin/bash
# A script to exec all services tests in Docker containers, just like in CI.

docker-compose exec apartments-api yarn run lint &&
docker-compose exec apartments-api yarn run test &&
docker-compose exec apartments-api yarn run test:integration &&
docker-compose exec notifications-service yarn run lint &&
docker-compose exec notifications-service yarn run test &&
docker-compose exec notifications-service yarn run test:integration &&
docker-compose exec front-gateway yarn run lint &&
docker-compose exec front-gateway yarn run test &&
docker-compose exec front-gateway yarn run test:integration

LINE WRAP ON
RED='\033[1;31m'
GREEN='\033[1;32m'
RC=$?;

if [[[ $RC != 0 ]]; then
  printf "${RED}Some tests failed.\n"
else
  printf "${GREEN}All tests passed.\n"
fi
