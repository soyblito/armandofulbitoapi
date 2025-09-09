## login

docker login registry.shsoftware.com.ar

## imagen

docker build -t registry.shsoftware.com.ar/apifulbito:latest .

## subir imagen

docker push registry.shsoftware.com.ar/apifulbito:latest

////////////////////////

# 🌐 Servidor

PORT=4000
NODE_ENV=development

# 🗄️ Base de datos

MONGO_URI=mongodb://dbo:nqx3p2kTut7sLGKN4zFrVJ@api.shsoftware.com.ar:27018,api.shsoftware.com.ar:27019,api.shsoftware.com.ar:27020/apidb?replicaSet=rs0&authSource=apidb

# 🔐 JWT

JWT_SECRET=supersecretkey123456
JWT_REFRESH_SECRET=superrefreshsecret78910
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# 🍪 Cookies (solo para Web)

COOKIE_NAME=refresh_token

# 🚦 Rate limiting

THROTTLE_TTL=60
THROTTLE_LIMIT=10

# 📊 Logs / Analytics (ej futuro)

REDIS_URI=redis://localhost:6379
