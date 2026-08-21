import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, useI18next } from 'gatsby-plugin-react-i18next';
import { useLocation } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';

// https://www.gatsbyjs.com/docs/add-seo-component/

const Head = ({ title, description, image }) => {
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
    title: title || defaultTitle,
    description: description || t('site.description'),
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };

  return (
    <Helmet title={title} defaultTitle={seo.title} titleTemplate={`%s | ${defaultTitle}`}>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

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
    </Helmet>
  );
};

export default Head;

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Head.defaultProps = {
  title: null,
  description: null,
  image: null,
};
