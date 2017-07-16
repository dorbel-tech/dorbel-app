#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" # Get the scripts folder location in order to run dbCleaner
                                                        # This way this script can be called from anywhere and find dbCleaner.js
echo "Cleaning the database"
node $DIR/dbCleaner.js
exit 0
