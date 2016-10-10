# needed for piping output to bunyan when running through visual studio code
node_modules/babel-cli/bin/babel-node.js $* | node_modules/bunyan/bin/bunyan
