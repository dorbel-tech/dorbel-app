# Image to pull.
FROM nodesource/node:4

# Working directory environment variable.
ENV WORKDIR="/home/nodejs/app"

# Create working directory in container.
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# Install dependencies before to cache node_modules.
COPY package.json $WORKDIR
RUN npm install --silent

# Copy all files from host to container.
COPY . $WORKDIR

RUN npm run build

# Open port
EXPOSE 3001

# Run node server.
CMD [ "npm", "start" ]
