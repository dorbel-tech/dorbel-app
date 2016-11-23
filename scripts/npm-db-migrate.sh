#!/bin/bash
# A script to run all DB migration scritps.

npm --prefix ./apartments-api run db:migrate && 
npm --prefix ./ohe-api run db:migrate 