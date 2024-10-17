FROM node:20.11.1

WORKDIR /app

#COPY .frontend/package*.json ./
COPY package*.json ./

RUN npm install

COPY . .

#EXPOSE 5173

#RUN npm run build

CMD ["npm", "run", "dev"]

