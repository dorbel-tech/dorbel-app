# Image to pull.
FROM dorbel/alpine-node:8.2.1

# Install dependencies before to cache node_modules.
COPY package.json yarn.lock $WORKDIR

# Temporary solution to fix node-sass problem.
# Remove it after resolution - https://github.com/sass/node-sass/issues/1868
RUN mkdir -p $HOME && npm install node-sass@4.3.0 --silent && npm cache clean --force
RUN yarn install --pure-lockfile && yarn cache clean

# Copy all files from host to container.
COPY . $WORKDIR

# Build client
RUN yarn run build

# Open port
EXPOSE 3001

# Run node server.
CMD [ "yarn", "start" ]
