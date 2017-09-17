#!/bin/bash
set -x # Print all commands to terminal as executed.
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately.

# Cleanup when going out of space
find ~/.rbenv/versions -maxdepth 1 -type d | grep -v "$(rbenv version | awk '{print $1}')" | tail -n +2 | xargs rm -rf
find ~/.nvm/versions/node/ -maxdepth 1 -type d | grep -v "$(node --version)" | tail -n +2 | xargs rm -rf
rm -rf ~/.phpbrew/

# Cache restore, disabled as inconsitent.
# docker-cache restore

# Creating directories for codecov.io for code coverage report mounted volume.
mkdir apartments-api-shared
# mkdir ohe-api-shared
mkdir notifications-service-shared
mkdir front-gateway-shared

# Checking wich directories were changed in this branch to execute only the relevant build/test/deploy.
# changed_directories=$(git diff-tree --no-commit-id --name-only $REVISION); echo $changed_directories

# Starting docker composition
docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d --force-recreate --build
