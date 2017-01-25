# Image to pull.
FROM dorbel/alpine-node

# Working directory environment variable.
ENV WORKDIR="/home/nodejs/app/"

# Create working directory in container.
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# Temporary solution to fix node-sass problem.
# Remove it after resolution - https://github.com/sass/node-sass/issues/1868
RUN mkdir -p $HOME && npm install --global node-sass --no-progress --no-cache

# Install dependencies before to cache node_modules.
COPY package.json yarn.lock $WORKDIR
RUN yarn install --pure-lockfile && yarn cache clean

# Copy all files from host to container.
COPY . $WORKDIR

# Build client
RUN yarn run build

# Open port
EXPOSE 3001

# Run node server.
CMD [ "yarn", "start" ]
