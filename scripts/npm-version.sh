#!/bin/bash
# A script to install all modules dependencies.

npm version $1 -m 'version bump as a result of new deployment' --force
npm --prefix ./apartments-api version $1 -m 'version bump as a result of new deployment' --force
npm --prefix ./shared version $1 -m 'version bump as a result of new deployment' --force
