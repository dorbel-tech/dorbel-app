#!/bin/bash
# A script to change version of all application services.

npm --prefix ./apartments-api version $1 -m 'version bump as a result of new deployment' --force
