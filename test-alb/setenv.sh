#!/bin/bash
file=$1
while IFS= read -r line
do
	eb setenv -e apartments-api-test-new $line
done <"$file"
