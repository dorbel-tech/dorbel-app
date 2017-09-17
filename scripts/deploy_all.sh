#!/bin/bash
# A script to deploy all Docker containers to AWS Elastic Beanstalk single container test environment.

yarn run deploy apartments-api $1 &
yarn run deploy front-gateway $1 &
yarn run deploy notifications-service $1
# yarn run deploy ohe-api $1
