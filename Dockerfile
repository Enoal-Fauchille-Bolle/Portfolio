# Étape 1 : Construction
FROM node:20-alpine AS build

WORKDIR /app

# Installation des dépendances système nécessaires pour la compilation des modules natifs
RUN apk add --no-cache \
	python3 \
	make \
	g++ \
	autoconf \
	automake \
	libtool \
	nasm \
	pkgconf \
	zlib-dev \
	libpng-dev

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances avec les options nécessaires pour ce projet
RUN npm ci --legacy-peer-deps

# Copie du reste du projet (en excluant node_modules via .dockerignore)
COPY . .

# Configuration pour supporter l'ancien provider OpenSSL (nécessaire pour Gatsby v4 sur Node 17+)
ENV NODE_OPTIONS=--openssl-legacy-provider

# Analytics Umami : Gatsby inline les variables GATSBY_* dans les fichiers statiques
# au moment du build, elles ne sont donc pas lisibles au démarrage du conteneur.
# Sans valeur, le script de suivi n'est tout simplement pas injecté.
ARG GATSBY_UMAMI_WEBSITE_ID=""
ARG GATSBY_UMAMI_DOMAINS=""
ARG GATSBY_UMAMI_HOST_URL=""
ENV GATSBY_UMAMI_WEBSITE_ID=$GATSBY_UMAMI_WEBSITE_ID
ENV GATSBY_UMAMI_DOMAINS=$GATSBY_UMAMI_DOMAINS
ENV GATSBY_UMAMI_HOST_URL=$GATSBY_UMAMI_HOST_URL

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
