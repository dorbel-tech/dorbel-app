#!/bin/bash
# A script to deploy all Docker containers to AWS Elastic Beanstalk single container test environment.

yarn run deploy apartments-api test &
yarn run deploy front-gateway test &
yarn run deploy notifications-service test &
yarn run deploy ohe-api test    
