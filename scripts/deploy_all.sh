#!/bin/bash
# A script to deploy all Docker containers to AWS Elastic Beanstalk single container test environment.

yarn deploy apartments-api test &
yarn deploy front-gateway test &
yarn deploy notifications-service test &
yarn deploy ohe-api test    
