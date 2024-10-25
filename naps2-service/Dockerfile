FROM node:20-alpine3.19

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001

CMD ["node", "naps2-service.js"]
