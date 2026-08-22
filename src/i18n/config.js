// Source de vérité unique de la liste des langues : gatsby-node.js s'en sert pour
// dupliquer les pages, le runtime pour préfixer les liens et construire les balises
// hreflang.
//
// En CommonJS parce que gatsby-node.js est chargé par Node, hors du bundle webpack :
// il ne peut ni passer par l'alias @i18n, ni lire un module ESM.
module.exports = {
  languages: ['fr', 'en'],
  // Le français est servi sur `/` sans préfixe ; seul l'anglais est routé sous `/en/`.
  // `/fr` est traité par une redirection 301 dans nginx.
  //
  // Aucune redirection automatique sur la langue du navigateur : `enoal.fr` doit
  // vouloir dire la même chose pour tout le monde. Le choix passe par le sélecteur
  // de langue, donc par le visiteur.
  defaultLanguage: 'fr',
};
