# Image to pull.
FROM dorbel/alpine-node:8.2.1

# Install dependencies before to cache node_modules.
COPY package.json yarn.lock $WORKDIR
RUN yarn install --pure-lockfile && yarn cache clean

# Copy all files from host to container.
COPY . $WORKDIR

# Open port
EXPOSE 3000

# Run node server.
CMD [ "yarn", "start" ]
