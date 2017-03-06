#!/bin/bash
set -x #echo on

docker-compose exec apartments-api yarn run lint
docker-compose exec apartments-api yarn run test:seed
docker-compose exec apartments-api yarn run test
docker-compose exec apartments-api cp -v ./test/coverage/coverage-final.json /shared/
docker-compose exec apartments-api yarn run test:integration
