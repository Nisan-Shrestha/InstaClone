FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

EXPOSE 8000

COPY .  .

CMD ["npm","run", "start"]
# CMD ["npm","run", "test"]