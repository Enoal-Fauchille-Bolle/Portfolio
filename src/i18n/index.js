import React, { createContext, forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { languages, defaultLanguage } from './config';
import frTranslation from '../../locales/fr/translation.json';
import enTranslation from '../../locales/en/translation.json';

// Les traductions sont importées, pas requêtées. Les deux fichiers pèsent ensemble
// moins de 7 ko : les embarquer coûte moins cher que la requête GraphQL `locales`
// que chaque page devait déclarer, et surtout elles deviennent lisibles depuis le
// <head>, que la Head API rend dans un arbre React séparé du provider.
const resources = {
  fr: { translation: frTranslation },
  en: { translation: enTranslation },
};

// Le namespace reprend le nom des fichiers, comme le faisait le nœud Locale.
const defaultNS = 'translation';

const instances = {};

// Une instance i18next par langue, mémoïsée. Sûr parce que les ressources sont
// statiques et que chaque instance reste figée sur sa langue : personne n'appelle
// jamais changeLanguage, le changement de langue passe par une navigation.
export const getI18n = language => {
  if (!instances[language]) {
    const instance = i18next.createInstance();

    instance.init({
      resources,
      lng: language,
      fallbackLng: defaultLanguage,
      defaultNS,
      // Les traductions contiennent des balises que <Trans> transforme en JSX :
      // les échapper les afficherait telles quelles.
      interpolation: { escapeValue: false },
      // Les ressources sont déjà là au premier rendu, il n'y a rien à suspendre —
      // et Suspense ne survivrait pas au rendu HTML statique.
      react: { useSuspense: false },
    });

    instances[language] = instance;
  }

  return instances[language];
};

// Ne porte que ce que les composants consomment réellement. Le plugin exposait en
// plus `routed`, `path`, `siteUrl`, `navigate` et `changeLanguage`, qu'aucun fichier
// du dépôt n'utilisait.
export const I18nextContext = createContext({
  language: defaultLanguage,
  languages,
  originalPath: '/',
  defaultLanguage,
});

export const useI18next = () => {
  const { t } = useTranslation();
  const context = useContext(I18nextContext);

  return { ...context, t };
};

const languagePath = language => (language === defaultLanguage ? '' : `/${language}`);

// Link préfixe le chemin par la langue visée, celle du contexte par défaut. C'est
// aussi le sélecteur de langue : `to={originalPath}` avec `language={lng}` reste sur
// la même page dans l'autre langue.
export const Link = forwardRef(({ language, to, ...rest }, ref) => {
  const context = useContext(I18nextContext);
  const target = language || context.language;

  return <GatsbyLink {...rest} ref={ref} to={`${languagePath(target)}${to}`} hrefLang={target} />;
});

Link.displayName = 'Link';

Link.propTypes = {
  language: PropTypes.string,
  to: PropTypes.string.isRequired,
};

// Le <head> est rendu hors du provider : il lui faut une lecture des traductions qui
// ne dépende d'aucun contexte React. Comme t(), la fonction renvoyée rend la clé
// elle-même quand la traduction manque — une balise qui afficherait `site.description`
// saute aux yeux lors de la vérification du HTML généré.
export const translate = language => {
  const parsed = resources[language]?.translation || {};

  return key => {
    const value = key.split('.').reduce((branch, part) => branch?.[part], parsed);
    return typeof value === 'string' ? value : key;
  };
};

// La langue du navigateur ne sert qu'à *suggérer* : `config.js` interdit toute
// redirection automatique. Ces trois fonctions ne touchent à `navigator` et à
// `localStorage` que dans leur corps — le module est aussi chargé au build, par le
// <head>, où ni l'un ni l'autre n'existe.
const LANG_HINT_KEY = 'lang-hint-dismissed';

// Reprend le rôle de `browser-lang`, qui disparaît avec le greffon : normalise chaque
// étiquette (`en-US` -> `en`) et renvoie la première langue du navigateur que le site
// sait servir. `navigator.languages` est déjà classé par préférence décroissante, donc
// la première trouvée est la bonne — `browser-lang`, lui, ne lisait que `languages[0]`
// et ignorait le reste de la liste.
export const detectLanguage = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];

  return (
    preferred
      .filter(Boolean)
      .map(tag => tag.toLowerCase().split('-')[0])
      .find(code => languages.includes(code)) || null
  );
};

// Un drapeau, pas une langue. La clé ne contient rien qui permette de rediriger, elle
// dit seulement que le visiteur a déjà tranché la question — en fermant le bandeau, en
// l'acceptant, ou en utilisant le sélecteur.
export const isLangHintDismissed = () => {
  try {
    return localStorage.getItem(LANG_HINT_KEY) === '1';
  } catch {
    // Stockage indisponible (navigation privée stricte) : mieux vaut afficher le
    // bandeau et perdre la persistance que perdre la fonctionnalité.
    return false;
  }
};

export const dismissLangHint = () => {
  try {
    localStorage.setItem(LANG_HINT_KEY, '1');
  } catch {
    // Le bandeau reparaîtra au prochain chargement : c'est le moindre mal.
  }
};
