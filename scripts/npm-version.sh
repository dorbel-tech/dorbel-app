#!/bin/bash
# A script to install all modules dependencies.

npm version $1 -m 'version bump as a result of new deployment'
npm --prefix ./apartments-api version $1 -m 'version bump as a result of new deployment'
npm --prefix ./shared version $1 -m 'version bump as a result of new deployment'
