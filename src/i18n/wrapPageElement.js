import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { I18nextContext, getI18n } from './index';

// Réimplémente le wrapPageElement que gatsby-plugin-react-i18next posait : l'instance
// i18next de la langue de la page, plus le contexte que useI18next et Link relisent.
// `i18n` vient du pageContext construit par onCreatePage (gatsby-node.js).
export const wrapPageElement = ({ element, props }) => {
  const context = props?.pageContext?.i18n;

  if (!context) {
    return element;
  }

  return (
    <I18nextProvider i18n={getI18n(context.language)}>
      <I18nextContext.Provider value={context}>{element}</I18nextContext.Provider>
    </I18nextProvider>
  );
};
