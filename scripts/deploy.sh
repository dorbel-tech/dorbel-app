#!/bin/bash
# A script to deploy Docker containers to AWS Elastic Beanstalk single container environment.

SERVICE_NAME=""
ENV_NAME=""

if [ $# -eq 0 ]; then
    echo "No arguments provided."
    echo "[npm run deploy service-name dev] should work."
    exit 1
fi

if [ ! -z "$1" ]; then
  SERVICE_NAME=$1
fi

if [ ! -z "$2" ]; then
  case $2 in
    dev)
      ENV_NAME="${SERVICE_NAME}-develop" ;;
    test)
      ENV_NAME="${SERVICE_NAME}-test" ;;
    stage)
      ENV_NAME="${SERVICE_NAME}-stage" ;;
    prod)
      ENV_NAME="${SERVICE_NAME}-production" ;;
    *)
      ;;
  esac

fi

cd $SERVICE_NAME

# Change version in all npm package files
VERSION=$(npm version patch)
VERSION_WITHFLAG="--label ${VERSION} ${GIT_SHA1}"

# Stage all changes
git add .
git commit -m $VERSION
git push

GIT_SHA1=$(git rev-parse --short HEAD)

echo "Starting deployment of ${SERVICE_NAME} ${VERSION} ${GIT_SHA1} to ${ENV_NAME}."

# Deploy application to AWS EB
COMMIT_MESSAGE=$(git log -1 --oneline)
eb deploy $ENV_NAME $VERSION_WITHFLAG --message "$COMMIT_MESSAGE"

cd ..
