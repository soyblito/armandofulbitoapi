# Usa una imagen base de Node.js
FROM node:18-alpine
# Establece el directorio de trabajo en el contenedor
WORKDIR /app
# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./
# Instala las dependencias
RUN npm install
# Copia el resto de la aplicación al contenedor
COPY . .
RUN rm -f .env
# Compila el proyecto de TypeScript a JavaScript
RUN npm run build
# Expone el puerto en el que corre la API
EXPOSE 4000
# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]