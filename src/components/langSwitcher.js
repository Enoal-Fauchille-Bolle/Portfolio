import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

const StyledLangSwitcher = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  line-height: 1;
  white-space: nowrap;

  a {
    padding: 6px;
    color: var(--light-slate);
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--green);
    }

    &.active {
      color: var(--green);
    }
  }

  .separator {
    color: var(--lightest-navy);
    user-select: none;
  }
`;

// `originalPath` est le chemin débarrassé du préfixe de langue : on reste donc sur
// la même page en changeant de langue (/archive -> /en/archive), au lieu de
// retomber sur l'accueil. Le Link du plugin construit le préfixe tout seul.
const LangSwitcher = ({ className, onNavigate }) => {
  const { languages, language, originalPath, t } = useI18next();

  return (
    <StyledLangSwitcher className={className} aria-label={t('language.switch')}>
      {languages.map((lng, i) => (
        <React.Fragment key={lng}>
          {i > 0 && <span className="separator">/</span>}
          <Link
            to={originalPath}
            language={lng}
            className={lng === language ? 'active' : ''}
            aria-current={lng === language ? 'true' : undefined}
            title={t(`language.${lng}`)}
            onClick={onNavigate}
            data-umami-event="language-switch"
            data-umami-event-language={lng}>
            {lng.toUpperCase()}
          </Link>
        </React.Fragment>
      ))}
    </StyledLangSwitcher>
  );
};

LangSwitcher.propTypes = {
  className: PropTypes.string,
  onNavigate: PropTypes.func,
};

export default LangSwitcher;
