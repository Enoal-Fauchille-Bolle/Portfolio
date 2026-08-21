const config = require('./src/config');

module.exports = {
  siteMetadata: {
    title: 'Enoal Fauchille--Bolle',
    description:
      'Enoal Fauchille--Bolle est un étudiant développeur Full-stack, DevOps et Logiciel à Epitech Nantes.',
    siteUrl: 'https://enoal.fr', // No trailing slash allowed!
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
    `gatsby-plugin-robots-txt`,
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
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/content/projects`,
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
        siteUrl: 'https://enoal.fr',
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
