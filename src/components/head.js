import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, useI18next } from 'gatsby-plugin-react-i18next';
import { useLocation } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';
import config from '@config';

// https://www.gatsbyjs.com/docs/add-seo-component/

const Head = ({ title, description, image, noindex }) => {
  const { pathname } = useLocation();
  const { t } = useI18next();

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            defaultTitle: title
            siteUrl
            defaultImage: image
          }
        }
      }
    `,
  );

  const { defaultTitle, siteUrl, defaultImage } = site.siteMetadata;

  const seo = {
    // Les balises sociales ne passent pas par le `titleTemplate` de Helmet, qui
    // ne s'applique qu'à <title>. Sans cette concaténation, un partage de
    // /archive s'annoncerait simplement « Archive », sans dire de qui.
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || t('site.description'),
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
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
    <Helmet title={title} defaultTitle={seo.title} titleTemplate={`%s | ${defaultTitle}`}>
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
    </Helmet>
  );
};

export default Head;

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  noindex: PropTypes.bool,
};

Head.defaultProps = {
  title: null,
  description: null,
  image: null,
  noindex: false,
};
