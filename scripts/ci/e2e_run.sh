#!/bin/bash
set -x # Print all commands to terminal as executed.

cd front-gateway && yarn install

# Run the command 3 times to fight flakiness.
for i in {1..3}; 
do FRONT_GATEWAY_URL=$1 yarn run test:e2e:browserstack && break; 
done

cd ..