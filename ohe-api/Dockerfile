# Image to pull.
FROM dorbel/alpine-node-yarn-git

# Working directory environment variable.
ENV WORKDIR="/home/nodejs/app/"

# Create working directory in container.
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# Install dependencies before to cache node_modules.
COPY package.json yarn.lock $WORKDIR
RUN yarn install --pure-lockfile

# Copy all files from host to container.
COPY . $WORKDIR

# Open port
EXPOSE 3003

# Run node server.
CMD [ "yarn", "start" ]
