const config = require('./src/config');

// Une seule source de vérité : siteMetadata, les balises canonical/hreflang du
// plugin i18n et robots.txt doivent annoncer exactement la même origine.
const siteUrl = 'https://enoal.fr'; // Pas de slash final

module.exports = {
  siteMetadata: {
    title: 'Enoal Fauchille--Bolle',
    // La description du site vit dans locales/<langue>/translation.json, sous la
    // clé site.description, et c'est head.js qui la lit.
    siteUrl,
    image: '/og.png', // Path to your image you placed in the 'static' folder
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        // La v4 appelle simpleSitemapAndIndex() sans lui passer `publicBasePath`
        // (gatsby-node.js:118-123) : l'index construit donc ses liens depuis la
        // racine (`/sitemap-0.xml`) alors que le dossier de sortie par défaut est
        // `/sitemap`. La chaîne pointe dans le vide. On écrit à la racine pour que
        // les liens de l'index correspondent aux fichiers réellement produits.
        output: `/`,
        // Corollaire de output: `/` — le plugin construit le lien du <head> avec
        // withoutTrailingSlash(output), qui renvoie `/` tel quel (internals.js:27)
        // et produit donc `//sitemap-index.xml`, lu comme un nom d'hôte. On coupe
        // ce lien : <link rel="sitemap"> n'est pas un standard et aucun moteur ne
        // s'en sert. La découverte passe par la ligne Sitemap de robots.txt.
        createLinkInHead: false,
        // Les exclusions par défaut du plugin (/404, /404.html, /dev-404-page,
        // /offline-plugin-app-shell-fallback) sont des chemins exacts : elles
        // laissent passer les variantes préfixées par la langue. Ces globs les
        // rattrapent pour toute langue présente ou future.
        excludes: [
          `/*/404`,
          `/*/404.html`,
          `/*/dev-404-page`,
          `/*/offline-plugin-app-shell-fallback`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        // Les deux options sont indispensables ensemble : si l'une manque, le
        // plugin les redérive toutes les deux depuis siteUrl et réécrit sitemap
        // en `/sitemap.xml`, qui n'existe pas.
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap-index.xml`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Enoal Fauchille--Bolle',
        short_name: 'Enoal Fauchille--Bolle',
        start_url: '/',
        background_color: config.colors.darkNavy,
        theme_color: config.colors.navy,
        display: 'minimal-ui',
        icon: 'src/images/logo.png',
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      // Une seule instance pour tout `content/` : `content/projects` était déclaré
      // une seconde fois, ce qui créait deux fois les mêmes nœuds File (même
      // identifiant, dérivé du chemin absolu) pour chaque fiche de projet. Aucune
      // requête ne filtre sur `sourceInstanceName` — elles utilisent toutes une
      // regex sur `fileAbsolutePath` — la seconde instance ne servait donc qu'à
      // relire et rehacher les mêmes fichiers.
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `locale`,
        path: `${__dirname}/locales`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`fr`, `en`],
        defaultLanguage: `fr`,
        // Le français reste servi sur `/` sans préfixe ; seul l'anglais est routé
        // sous `/en/`. `/fr` est traité par une redirection 301 dans nginx.
        generateDefaultLanguagePage: false,
        // Aucune redirection automatique sur la langue du navigateur : `enoal.fr`
        // doit vouloir dire la même chose pour tout le monde. Le choix passe par
        // le sélecteur de langue, donc par le visiteur.
        redirect: false,
        // Sans slash final : le Helmet du plugin concatène brut pour construire
        // les balises canonical et hreflang.
        siteUrl,
        i18nextOptions: {
          interpolation: { escapeValue: false },
        },
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            // https://www.gatsbyjs.org/packages/gatsby-remark-external-links
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
          },
        ],
      },
    },
  ],
};
