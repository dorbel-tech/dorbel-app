#!/bin/bash
# A script to start/stop Docker compose local environment.

if [ $# -eq 0 ]; then
    echo "No arguments provided."
    echo "[start] or [stop] are valid options."
    exit 1
fi

if [[ $1 == "start" ]]; then
    docker-compose -f docker-compose.yml -f docker-compose.development.yml up --force-recreate --build
elif [[ $1 == "stop" ]]; then
    docker-compose down
fi
