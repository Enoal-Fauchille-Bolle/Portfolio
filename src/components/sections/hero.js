import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Trans } from 'react-i18next';
import { useI18next } from '@i18n';
import styled from 'styled-components';
import { navDelay, revealDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const { t } = useI18next();
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>{t('hero.greeting')}</h1>;
  const two = <h2 className="big-heading">Enoal Fauchille--Bolle.</h2>;
  const three = <h3 className="medium-heading">{t('hero.tagline')}</h3>;
  // Trans garde le lien dans le flux de la phrase : la traduction porte la balise
  // <ruc>…</ruc> et le JSX fournit le <a> avec ses attributs de suivi intacts.
  const four = (
    <>
      <p>
        <Trans
          i18nKey="hero.intro"
          components={{
            ruc: (
              <a
                href="https://ruc.dk/en"
                target="_blank"
                rel="noreferrer"
                data-umami-event="outbound-click"
                data-umami-event-destination="roskilde-university"
                data-umami-event-source="hero">
                Roskilde University
              </a>
            ),
          }}
        />
      </p>
    </>
  );
  const five = (
    <a
      className="email-link"
      href="mailto:contact@enoal.fr"
      rel="noreferrer"
      data-umami-event="contact-click"
      data-umami-event-channel="email"
      data-umami-event-source="hero">
      {t('hero.cta')}
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={revealDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
