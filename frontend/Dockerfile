FROM node:20

WORKDIR /app

#COPY .frontend/package*.json ./
COPY package*.json package-lock.json ./

RUN npm install

COPY . .

# Elimina node_modules antes de reinstalar
RUN rm -rf node_modules 

#EXPOSE 5173

CMD ["npm", "run", "dev"]

