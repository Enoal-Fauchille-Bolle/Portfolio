# Étape 1 : Construction
FROM node:20-alpine AS build

WORKDIR /app

# Installation des dépendances système nécessaires pour la compilation (Python, Make, G++)
RUN apk add --no-cache python3 make g++

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances avec les options nécessaires pour ce projet
RUN npm install --legacy-peer-deps

# Copie du reste du projet
COPY . .

# Configuration pour supporter l'ancien provider OpenSSL (nécessaire pour Gatsby v4 sur Node 17+)
ENV NODE_OPTIONS=--openssl-legacy-provider

# Construction du site statique (génère le dossier /public)
RUN npm run build

# Étape 2 : Serveur Web
FROM nginx:alpine

# Copie des fichiers statiques générés vers le dossier de Nginx
COPY --from=build /app/public /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
