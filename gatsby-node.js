/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

const { languages, defaultLanguage } = require('./src/i18n/config');

// https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scrollreveal/,
            use: loaders.null(),
          },
          {
            test: /animejs/,
            use: loaders.null(),
          },
          {
            test: /miniraf/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@i18n': path.resolve(__dirname, 'src/i18n'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};

// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#onCreatePage
//
// Tout le routage bilingue est produit ici. Chaque page créée par Gatsby est
// remplacée par une page française sur son chemin d'origine et une page anglaise
// préfixée `/en`, chacune portant sa langue dans son pageContext.
//
// C'est ce que faisait gatsby-plugin-react-i18next jusqu'à sa v3.
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // createPage rappelle onCreatePage : sans ce garde-fou, la fonction se rappelle
  // indéfiniment sur les pages qu'elle vient elle-même de créer.
  if (page.context?.i18n) {
    return;
  }

  const localizedPage = (language, path, matchPath) => ({
    ...page,
    path,
    matchPath,
    context: {
      ...page.context,
      language,
      i18n: {
        language,
        languages,
        defaultLanguage,
        // Le chemin débarrassé du préfixe de langue, donc identique dans les deux
        // langues. head.js en tire canonical et hreflang, langSwitcher s'en sert pour
        // rester sur la même page en changeant de langue, et layout pour reconnaître
        // l'accueil.
        originalPath: page.path,
      },
    },
  });

  deletePage(page);
  createPage(localizedPage(defaultLanguage, page.path, page.matchPath));

  languages
    .filter(language => language !== defaultLanguage)
    .forEach(language => {
      // La 404 d'une langue doit attraper tout ce qui n'a pas d'autre route sous son
      // préfixe, sans quoi /en/nimporte-quoi retomberait sur la 404 française.
      const matchPath = /\/404\/?$/.test(page.path)
        ? `/${language}/*`
        : page.matchPath && `/${language}${page.matchPath}`;

      createPage(localizedPage(language, `/${language}${page.path}`, matchPath));
    });
};
