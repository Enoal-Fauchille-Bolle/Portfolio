import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import config from '@config';
import { translationsFrom } from '@utils';

// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
//
// Ce composant n'est plus rendu depuis <Layout> mais depuis le `export const Head`
// de chaque page : la Head API de Gatsby rend le <head> dans un arbre React séparé,
// où le contexte de `wrapPageElement` — donc celui de gatsby-plugin-react-i18next —
// n'existe pas. Tout arrive par les props que Gatsby passe au Head : `pageContext`
// pour la langue, `data` pour les traductions.
const SeoHead = ({
  pageContext,
  data,
  titleKey = null,
  descriptionKey = null,
  image = null,
  noindex = false,
}) => {
  const { language, languages, originalPath, defaultLanguage } = pageContext.i18n;
  const t = translationsFrom(data);

  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          defaultTitle: title
          siteUrl
          defaultImage: image
        }
      }
    }
  `);

  const { defaultTitle, siteUrl, defaultImage } = site.siteMetadata;

  // Reprise à l'identique du <Helmet> que gatsby-plugin-react-i18next exportait
  // jusqu'à sa v1 : la v3 ne le fournit plus, et sans cette fonction le site perdrait
  // ses balises canonical et hreflang. `originalPath` est le chemin sans préfixe de
  // langue, le français étant servi sur `/` (generateDefaultLanguagePage: false).
  const urlForLanguage = lng => {
    const url = `${siteUrl}${lng === defaultLanguage ? '' : `/${lng}`}${originalPath}`;
    return url.endsWith('/') ? url : `${url}/`;
  };

  const title = titleKey ? t(titleKey) : null;

  const seo = {
    // La Head API ne connaît ni `titleTemplate` ni `defaultTitle` : la concaténation
    // que Helmet faisait pour <title> se fait ici. La même chaîne sert aux balises
    // sociales, comme aujourd'hui — sans quoi un partage de /archive s'annoncerait
    // simplement « Archive », sans dire de qui.
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: descriptionKey ? t(descriptionKey) : t('site.description'),
    image: `${siteUrl}${image || defaultImage}`,
    // og:url doit désigner la même ressource que canonical : on réutilise la même
    // construction plutôt que location.pathname, qui ne normalise pas le slash final.
    url: urlForLanguage(language),
  };

  // Google se sert du balisage Person pour rattacher le site à une personne et
  // afficher un panneau de connaissance. Les données viennent de src/config.js,
  // il n'y a donc rien à tenir à jour en double.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: defaultTitle,
    url: siteUrl,
    image: `${siteUrl}${defaultImage}`,
    email: `mailto:${config.email}`,
    description: seo.description,
    sameAs: config.socialMedia.map(({ url }) => url),
  };

  return (
    <>
      <html lang={language} />
      <title>{seo.title}</title>

      <link rel="canonical" href={seo.url} />
      {languages.map(lng => (
        <link rel="alternate" key={lng} href={urlForLanguage(lng)} hrefLang={lng} />
      ))}
      <link rel="alternate" href={urlForLanguage(defaultLanguage)} hrefLang="x-default" />

      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

      {/* Les pages sans valeur de recherche (404, page d'erreur localisée) sont
          servies en 200 par nginx sur leur URL propre : sans cette balise, un
          moteur peut les indexer comme des pages ordinaires. */}
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={t('site.ogLocale')} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </>
  );
};

export default SeoHead;

SeoHead.propTypes = {
  pageContext: PropTypes.object.isRequired,
  data: PropTypes.object,
  titleKey: PropTypes.string,
  descriptionKey: PropTypes.string,
  image: PropTypes.string,
  noindex: PropTypes.bool,
};
