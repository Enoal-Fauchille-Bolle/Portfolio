import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { Trans, useI18next } from 'gatsby-plugin-react-i18next';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const { t } = useI18next();
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'TypeScript',
    'JavaScript',
    'React',
    'Node.js',
    'NestJS',
    'Express',
    'Python',
    'Rust',
    'C/C++',
    'Git',
    'Docker',
    'Kubernetes',
    'Ansible',
    'PostgreSQL',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">{t('about.heading')}</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              <Trans
                i18nKey="about.p1"
                components={{
                  epitech: (
                    <a
                      href="https://www.epitech.eu/"
                      target="_blank"
                      rel="noreferrer"
                      data-umami-event="outbound-click"
                      data-umami-event-destination="epitech"
                      data-umami-event-source="about">
                      Epitech Nantes
                    </a>
                  ),
                }}
              />
            </p>

            <p>
              <Trans
                i18nKey="about.p2"
                components={{
                  ruc: (
                    <a
                      href="https://ruc.dk/en"
                      target="_blank"
                      rel="noreferrer"
                      data-umami-event="outbound-click"
                      data-umami-event-destination="roskilde-university"
                      data-umami-event-source="about">
                      Roskilde University
                    </a>
                  ),
                }}
              />
            </p>

            <p>
              <Trans
                i18nKey="about.p3"
                components={{
                  revolte: (
                    <a
                      href="https://revolte.club/"
                      target="_blank"
                      rel="noreferrer"
                      data-umami-event="outbound-click"
                      data-umami-event-destination="revolte"
                      data-umami-event-source="about">
                      Revolte E-garages
                    </a>
                  ),
                  reso2d: (
                    <a
                      href="https://www.helloasso.com/associations/reso2d/"
                      target="_blank"
                      rel="noreferrer"
                      data-umami-event="outbound-click"
                      data-umami-event-destination="reso2d"
                      data-umami-event-source="about">
                      RESO2D
                    </a>
                  ),
                }}
              />
            </p>

            {/* <strong> fait partie de transKeepBasicHtmlNodesFor : la balise est
                conservée telle quelle depuis la traduction, sans composant à fournir. */}
            <p>
              <Trans i18nKey="about.softSkills" />
            </p>

            <p>{t('about.techIntro')}</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              // 95 produisait un fichier deux fois plus lourd que 80 pour une
              // différence invisible sur une photo affichée en 500 px de large.
              quality={80}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt={t('about.photoAlt')}
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
