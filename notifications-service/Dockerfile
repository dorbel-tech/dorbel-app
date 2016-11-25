# Image to pull.
FROM node:6
ENV NPM_CONFIG_LOGLEVEL warn

# Create non root user for better security + npm doesn't like root.
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
USER nodejs

# Working directory environment variable.
ENV WORKDIR="/home/nodejs/app"

# Create working directory in container.
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# Install dependencies before to cache node_modules.
COPY package.json $WORKDIR
RUN npm install --silent --production

# Copy all files from host to container.
COPY . $WORKDIR

# Open port
EXPOSE 3002

# Run node server.
CMD [ "npm", "start" ]
