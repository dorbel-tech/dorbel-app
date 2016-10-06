#!/bin/bash

if [ $# -eq 0 ]; then
    echo "No arguments provided."
    echo "[start] or [stop] are valid options."
    exit 1
fi

if [[ $1 == "start" ]]; then
    docker-compose up --force-recreate --build -d &&
    open http://localhost:3000/
elif [[ $1 == "stop" ]]; then
    docker-compose down
fi