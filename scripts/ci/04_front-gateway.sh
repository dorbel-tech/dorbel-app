#!/bin/bash
set -x #echo on

docker-compose exec front-gateway yarn run lint
docker-compose exec front-gateway yarn run test
docker-compose exec front-gateway cp -v ./test/coverage/coverage-final.json /shared/
docker-compose exec front-gateway yarn run test:integration
