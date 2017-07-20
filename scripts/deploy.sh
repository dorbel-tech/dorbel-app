#!/bin/bash
# A script to deploy Docker containers to AWS Elastic Beanstalk single container environment.

SERVICE_NAME=""
ENV_NAME=""

if [ $# -eq 0 ]; then
    echo "No arguments provided."
    echo "[yarn run deploy service-name test] should work."
    exit 1
fi

if [ ! -z "$1" ]; then
  SERVICE_NAME=$1
fi

if [ ! -z "$2" ]; then
  case $2 in
    test)
      ENV_NAME="${SERVICE_NAME}-test" ;;
    stage)
      ENV_NAME="${SERVICE_NAME}-staging" ;;
    *)
      ENV_NAME="$2" ;;
  esac

fi

cd $SERVICE_NAME

# Change version in all npm package files
GIT_SHA1=$(git rev-parse --short HEAD)
VERSION=$(npm version patch)
VERSION_WITHFLAG="--label ${VERSION}.${GIT_SHA1}"

echo "Starting deployment of ${SERVICE_NAME} ${VERSION} to ${ENV_NAME}."

# Deploy application to AWS EB
COMMIT_MESSAGE=$(git log -1 --pretty=%B | xargs)
eb deploy $ENV_NAME $VERSION_WITHFLAG --message "$COMMIT_MESSAGE"

cd ..
