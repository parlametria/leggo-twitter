FROM node:10-alpine

WORKDIR /app

COPY package* ./

RUN npm install

EXPOSE 5001

CMD npm run server
