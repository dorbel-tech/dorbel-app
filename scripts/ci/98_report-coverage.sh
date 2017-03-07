#!/bin/bash
set -x # Print all commands to terminal as executed.
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately.

bash <(curl -s https://codecov.io/bash)