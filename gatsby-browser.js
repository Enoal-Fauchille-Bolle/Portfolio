/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// Le même wrapPageElement que gatsby-ssr.js : il pose l'instance i18next de la langue
// de la page et le contexte que useI18next et Link relisent. Gatsby demande que les
// deux fichiers déclarent le même wrapper pour que l'hydratation concorde avec le
// HTML généré.
export { wrapPageElement } from './src/i18n/wrapPageElement';
