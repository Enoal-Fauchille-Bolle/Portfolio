import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, SeoHead, Hero, About, Jobs, Featured, Projects, Contact } from '@components';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Hero />
      <About />
      <Jobs />
      <Featured />
      <Projects />
      <Contact />
    </StyledMainContainer>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;

// Gatsby rend ce composant dans un arbre React séparé pour produire le <head> ; il
// reçoit `pageContext`, dont <SeoHead> tire la langue.
// L'accueil n'a pas de titre propre : il porte celui du site.
export const Head = props => <SeoHead {...props} />;
