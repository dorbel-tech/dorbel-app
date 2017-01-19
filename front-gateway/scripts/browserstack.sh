# Installing Browserstack local testing tunnel
# https://www.browserstack.com/local-testing#command-line
#!/usr/bin/env bash

if [ ! -f "./BrowserStackLocal" ]; then
    if [ "$(uname)" == "Darwin" ]; then
        # Do something under Mac OS X platform        
        wget https://www.browserstack.com/browserstack-local/BrowserStackLocal-darwin-x64.zip
        unzip BrowserStackLocal-darwin-x64.zip
    elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
        # Do something under GNU/Linux platform
        wget http://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip
        unzip BrowserStackLocal-linux-x64.zip
    fi
fi

./BrowserStackLocal $BROWSERSTACK_KEY localhost,3001,0 > /dev/null &
