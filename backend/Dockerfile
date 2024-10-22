FROM node:20-alpine3.19

WORKDIR /app

#COPY ./backend/package*.json ./
COPY package*.json ./

RUN npm install

COPY . .

# Expone el puerto 3000
EXPOSE 3000

#RUN npm run build

CMD ["npm", "run", "dev"]