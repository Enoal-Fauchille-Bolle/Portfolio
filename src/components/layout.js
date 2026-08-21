import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Head, Loader, Nav, Social, Email, Footer } from '@components';
import { GlobalStyle, theme } from '@styles';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// `title`, `description` et `noindex` remontent jusqu'à <Head> : c'est la seule
// instance de Helmet qui pose les balises canonical et hreflang, en rendre une
// deuxième depuis une page les dupliquerait. Chaque page décrit donc son propre
// référencement en passant ces props ici.
const Layout = ({ children, location, title, description, noindex }) => {
  const { t, originalPath } = useI18next();
  // location.pathname vaut '/en/' sur la home anglaise ; originalPath est le chemin
  // sans le préfixe de langue, donc '/' dans les deux langues. Sans ça, la version
  // anglaise perdrait le loader et l'animation d'entrée.
  const isHome = originalPath === '/';
  const [isLoading, setIsLoading] = useState(isHome);

  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
      allLinks.forEach(link => {
        if (link.host !== window.location.host) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (location.hash) {
      const id = location.hash.substring(1); // location.hash without the '#'
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    handleExternalLinks();
  }, [isLoading]);

  return (
    <>
      <Head title={title} description={description} noindex={noindex} />

      <div id="root">
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          <a className="skip-to-content" href="#content">
            {t('layout.skipToContent')}
          </a>

          {isLoading && isHome ? (
            <Loader finishLoading={() => setIsLoading(false)} />
          ) : (
            <StyledContent>
              <Nav isHome={isHome} />
              <Social isHome={isHome} />
              <Email isHome={isHome} />

              <div id="content">
                {children}
                <Footer />
              </div>
            </StyledContent>
          )}
        </ThemeProvider>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  noindex: PropTypes.bool,
};

export default Layout;
