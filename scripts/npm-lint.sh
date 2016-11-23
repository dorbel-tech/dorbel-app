#!/bin/bash
# A script to run all linting.

npm --prefix ./apartments-api run lint && 
npm --prefix ./front-gateway run lint &&
npm --prefix ./notifications-service run lint &&
npm --prefix ./ohe-api run lint
