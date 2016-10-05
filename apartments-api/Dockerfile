FROM nodesource/node:4

RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

COPY package.json /home/nodejs/app
RUN npm install --production --silent
COPY . /home/nodejs/app

EXPOSE 3000

CMD [ "npm", "start" ]
