#!/bin/bash
# A script to run all DB seed scritps.

npm --prefix ./apartments-api run db:seed && 
npm --prefix ./ohe-api run db:seed