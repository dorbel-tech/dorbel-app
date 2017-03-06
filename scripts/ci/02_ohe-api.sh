#!/bin/bash

docker-compose exec ohe-api yarn run lint
docker-compose exec ohe-api yarn run test:seed
docker-compose exec ohe-api yarn run test
docker-compose exec ohe-api cp -v ./test/coverage/coverage-final.json /shared/
docker-compose exec ohe-api yarn run test:integration
