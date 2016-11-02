#!/bin/bash
# A script to install all modules dependencies.

PROD=""

if [[ $1 == "prod" ]]; then
    PROD="-- production"
fi

npm --prefix ./apartments-api install $PROD &&
npm --prefix ./front-gateway install $PROD
