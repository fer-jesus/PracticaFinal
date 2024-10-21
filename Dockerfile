# ]archivo para el servicio de naps2
FROM node:14

# Crea un directorio de trabajo
WORKDIR /app

# Copia el archivo naps2-service.js al contenedor
COPY backend/naps2-service.js ./backend/naps2-service.js

# Si existe un package.json con dependencias, puedes descomentar las siguientes líneas
# COPY backend/package*.json ./
# RUN npm install

# Expone el puerto que usará la aplicación
EXPOSE 4000

# Comando para ejecutar el servicio
CMD ["node", "./backend/naps2-service.js"]
