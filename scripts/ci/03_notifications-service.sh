#!/bin/bash

docker-compose exec notifications-service yarn run lint
docker-compose exec notifications-service yarn run test
docker-compose exec notifications-service cp -v ./test/coverage/coverage-final.json /shared/
docker-compose exec notifications-service yarn run test:integration