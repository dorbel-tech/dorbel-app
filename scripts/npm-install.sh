#!/bin/bash
# A script to install all modules dependencies.

npm --prefix ./apartments-api install &&
npm --prefix ./front-gateway install
