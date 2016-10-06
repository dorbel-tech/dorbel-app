# Image to pull.
FROM nodesource/node:4

# Working directory environment variable.
ENV WORKDIR="/home/nodejs/app"
ENV APPDIR="apartments-api"

# Create non root "nodejs" user to run from for security reasons.
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
USER nodejs

# Create working directory in container.
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# Install dependencies before to cache node_modules.
COPY $APPDIR/package.json $WORKDIR
COPY shared $WORKDIR/../shared
RUN npm install --production --silent

# Copy all files from host to container.
COPY $APPDIR $WORKDIR

# Open port
EXPOSE 3000

# Run node server.
CMD [ "npm", "start" ]
