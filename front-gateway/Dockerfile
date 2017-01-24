# Image to pull.
# FROM dorbel/alpine-node
FROM kkarczmarczyk/node-yarn:6.9

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

# Build client
RUN yarn run build

# Open port
EXPOSE 3001

# Run node server.
CMD [ "yarn", "start" ]
