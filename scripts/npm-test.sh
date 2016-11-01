#!/bin/bash
# A script to run all modules tests.

npm --prefix ./apartments-api test && 
npm --prefix ./apartments-api run test:integration &&
npm --prefix ./front-gateway test && 
npm --prefix ./front-gateway run test:e2e
