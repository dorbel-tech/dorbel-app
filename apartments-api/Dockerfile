# Image to pull.
FROM kkarczmarczyk/node-yarn:6.9

# Create non root user for better security + npm doesn't like root.
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
USER nodejs

# Working directory environment variable.
ENV WORKDIR="/home/nodejs/app/"

# Create working directory in container.
RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

# Install dependencies before to cache node_modules.
COPY package.json yarn.lock $WORKDIR
RUN yarn install

# Copy all files from host to container.
COPY . $WORKDIR

# Open port
EXPOSE 3000

# Run node server.
CMD [ "yarn", "start" ]
