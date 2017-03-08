#!/bin/bash
set -x # Print all commands to terminal as executed.

cd front-gateway && yarn install

# Run the command until get 0 exit code or up to 3 times to fight flakiness.
try=1
FRONT_GATEWAY_URL=$1 yarn run test:e2e:browserstack 
while [ $? -ne 0 ] && [ $try -lt 3 ]; do 
  ((try++))
  FRONT_GATEWAY_URL=$1 yarn run test:e2e:browserstack 
done
exit $?