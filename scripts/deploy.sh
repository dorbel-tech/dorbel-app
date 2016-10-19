#!/bin/bash
# A script to deploy Docker containers to AWS Elastic Beanstalk single container environment.

SERVICE_NAME=""
ENV_NAME=""
VERSION=""

if [ $# -eq 0 ]; then
    echo "No arguments provided."
    echo "[npm run deploy service-name dev v0.0.1] should work."
    exit 1
fi

if [ ! -z "$1" ]; then
  SERVICE_NAME=$1
fi

if [ ! -z "$2" ]; then
  case $2 in
    dev)
      ENV_NAME="apartments-api-dev" ;;
    test)
      ENV_NAME="apartments-api-test" ;;
    stage)
      ENV_NAME="apartments-api-stage" ;;
    prod)
      ENV_NAME="apartments-api-dev-prod" ;;
    *)
      ;;
  esac

  if [ ! -z "$3" ]; then
    VERSION=$3
    VERSION_WITHFLAG="--label ${VERSION}"
  fi
fi

echo "Starting deployment of ${SERVICE_NAME} ${VERSION} to ${ENV_NAME}."

cd $SERVICE_NAME

# Change version in all npm package files
npm version $VERSION -m 'version bump as a result of new deployment'

# Stage all changes
git add .

# Deploy application to AWS EB
COMMIT_MESSAGE=$(git log -1 --oneline)
eb deploy $ENV_NAME $VERSION_WITHFLAG --staged --message "$COMMIT_MESSAGE"

cd ..
