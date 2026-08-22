# Étape 1 : Construction
FROM node:22-alpine AS build

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

# `--legacy-peer-deps` n'est plus nécessaire : depuis Gatsby 5, l'arbre de pairs
# se résout tel quel. S'il faut le remettre un jour, c'est qu'un conflit réel est
# apparu et qu'il vaut mieux le lire que le masquer.
RUN npm ci

# Copie du reste du projet (en excluant node_modules via .dockerignore)
COPY . .

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

# Les .js.map pèsent 4 Mo et exposent l'intégralité des sources. Le navigateur ne
# les télécharge que si les DevTools sont ouverts, mais ils restent servis
# publiquement et gonflent l'image d'autant. On les retire de l'artefact final ;
# ils restent produits pendant le build, donc disponibles en local.
RUN find /app/public -name '*.js.map' -delete

# Étape 2 : Serveur Web
FROM nginx:alpine

# Copie des fichiers statiques générés vers le dossier de Nginx
COPY --from=build /app/public /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
