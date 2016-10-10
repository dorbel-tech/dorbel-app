#!/bin/bash
# A script to start/stop Docker compose local environment.

if [ $# -eq 0 ]; then
    echo "No arguments provided."
    echo "[start] or [stop] are valid options."
    exit 1
fi

if [[ $1 == "start" ]]; then
    FRESH=""
    if [[ $2 == "fresh" ]]; then
        FRESH="--force-recreate --build"
    fi
    docker-compose -f docker-compose.yml -f docker-compose.development.yml up $FRESH
elif [[ $1 == "stop" ]]; then
    docker-compose down
fi
