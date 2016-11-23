#!/bin/bash
# A script to install all modules dependencies.

PROD=""

if [[ $1 == "prod" ]]; then
    PROD="--silent --production"
fi

npm --prefix ./apartments-api install $PROD &&
npm --prefix ./front-gateway install $PROD &&
npm --prefix ./notifications-service install $PROD &&
npm --prefix ./ohe-api install $PROD

