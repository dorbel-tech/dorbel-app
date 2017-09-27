#!/bin/bash
# A script to upgrade dorbel-shared module with new version in all projects at once.

if [ $# -eq 0 ]; then
    echo "No arguments provided."
    echo "[version] number is a valid options."
    exit 1
fi

if [[ $1 ]]; then
    VERSION=v$1
    PACKAGE_URL=dorbel-shared@git://github.com/dorbel-tech/dorbel-shared#$VERSION

    cd apartments-api && yarn upgrade $PACKAGE_URL && cd ..
    cd front-gateway && yarn upgrade $PACKAGE_URL && cd ..
    cd notifications-service && yarn upgrade $PACKAGE_URL && cd ..
fi
