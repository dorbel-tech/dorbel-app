FROM nodesource/node:4

RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

COPY . /home/nodejs/app
RUN npm install --production --silent

CMD [ "npm", "start" ]