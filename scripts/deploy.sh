#!/bin/bash
# A script to deploy Docker containers to AWS Elastic Beanstalk multi container environment.

ENV_NAME="dorbel-develop"

docker build -t dorbel/apartments-api:latest . -f apartments-api/Dockerfile
docker tag dorbel/apartments-api:latest 168720412882.dkr.ecr.eu-west-1.amazonaws.com/dorbel/apartments-api:latest
docker push 168720412882.dkr.ecr.eu-west-1.amazonaws.com/dorbel/apartments-api:latest