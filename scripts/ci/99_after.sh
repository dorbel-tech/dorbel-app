#!/bin/bash
set -x # Print all commands to terminal as executed.
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately.

# Remove container to save space.
docker rmi mysql

# Take docker images cache snapshot, disabled as inconcictent.
docker-cache snapshot
