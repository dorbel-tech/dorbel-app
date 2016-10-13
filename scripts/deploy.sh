#!/bin/bash
# A script to deploy Docker containers to AWS Elastic Beanstalk multi container environment.

ENV_NAME=""
VERSION=""

if [ ! -z "$1" ]; then
  case $1 in
    dev)
      ENV_NAME="dorbel-develop" ;;
    test)
      ENV_NAME="dorbel-test" ;;
    stage)
      ENV_NAME="dorbel-staging" ;;
    prod)
      ENV_NAME="dorbel-production" ;;
    *)
      ;;
  esac

  if [ ! -z "$2" ]; then
    VERSION=$2
    GIT_SHA1=$(git rev-parse --short HEAD)
    VERSION="${VERSION}.${GIT_SHA1}"
    VERSION_WITHFLAG="--label ${VERSION}"
  fi
fi

echo "Starting deployment of version ${VERSION} to ${ENV_NAME}."

# Build docker image for Apartments API and upload it to AWS RDS
docker build --no-cache -t dorbel/apartments-api . -f apartments-api/Dockerfile
docker tag dorbel/apartments-api:latest 168720412882.dkr.ecr.eu-west-1.amazonaws.com/dorbel/apartments-api:$VERSION
docker push 168720412882.dkr.ecr.eu-west-1.amazonaws.com/dorbel/apartments-api:$VERSION

# Replace Docker image version
REPLACE="s/latest/${VERSION}/g" 
sed -i -e $REPLACE Dockerrun.aws.json

# Stage all changes
git add .

# Deploy application to AWS EB
eb deploy $ENV_NAME $VERSION_WITHFLAG --staged

# Revert version change
mv Dockerrun.aws.json-e Dockerrun.aws.json

# Stage all changes again
git add .
