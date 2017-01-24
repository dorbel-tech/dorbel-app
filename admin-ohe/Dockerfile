# Image to pull.
FROM dorbel/alpine-node

# Working directory environment variable.
ENV WORKDIR="/home/nodejs/app/"

# Create working directory in container.
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# Install dependencies before to cache node_modules.
COPY package.json yarn.lock $WORKDIR
RUN yarn install --pure-lockfile && yarn cache clean

# Copy all files from host to container.
COPY . $WORKDIR

# Open port
EXPOSE 3005

# Run node server.
CMD [ "yarn", "start" ]
