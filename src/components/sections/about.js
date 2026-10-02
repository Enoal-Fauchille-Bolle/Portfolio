import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { Trans } from 'react-i18next';
import { useI18next } from '@i18n';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { localizeEdges } from '@utils';
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
      margin-bottom: 10px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }

    button {
      position: relative;
      padding: 0 0 0 20px;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;

      @media (prefers-reduced-motion: no-preference) {
        transition: var(--transition);
      }

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;

        @media (prefers-reduced-motion: no-preference) {
          transition: var(--transition);
        }
      }

      &:hover,
      &:focus-visible,
      &[aria-expanded='true'] {
        color: var(--green);
      }

      &[aria-expanded='true']:before {
        transform: rotate(90deg);
      }

      .count {
        opacity: 0.6;
      }
    }
  }

  /* La rangée passe de 0fr à 1fr : seule façon d'animer une hauteur « auto » en CSS.
     visibility retire le contenu fermé du parcours clavier et des lecteurs d'écran,
     après la fin du repli pour ne pas le couper en pleine animation. */
  .tech-panel {
    display: grid;
    grid-template-rows: 0fr;
    visibility: hidden;

    @media (prefers-reduced-motion: no-preference) {
      transition:
        grid-template-rows 0.25s var(--easing),
        visibility 0s 0.25s;
    }

    &.open {
      grid-template-rows: 1fr;
      visibility: visible;

      @media (prefers-reduced-motion: no-preference) {
        transition: grid-template-rows 0.25s var(--easing);
      }
    }

    .tech-panel-inner {
      min-height: 0;
      overflow: hidden;
    }

    /* Repris de la maquette validée : encadré foncé, liseré à gauche, nom de la
       techno en tête, projets en clair et contexte en plus petit. */
    .tech-panel-box {
      max-width: 420px;
      margin-top: 10px;
      padding: 10px 12px;
      border-left: 1px solid var(--green);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      background-color: var(--light-navy);
      font-family: var(--font-mono);
    }

    .tech-panel-skill {
      margin: 0 0 6px;
      color: var(--green);
      font-size: var(--fz-xs);
    }

    .tech-panel-title {
      margin: 0 0 6px;
      color: var(--green);
      font-size: var(--fz-xxs);
      letter-spacing: 0.04em;
    }

    ul {
      ${({ theme }) => theme.mixins.resetList};
      display: grid;
      gap: 6px;
    }

    li {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
      font-size: var(--fz-xs);
    }

    a,
    .title {
      color: var(--lightest-slate);
    }

    a {
      display: inline-flex;
      align-items: baseline;
      gap: 6px;

      @media (prefers-reduced-motion: no-preference) {
        transition: var(--transition);
      }

      &:hover,
      &:focus-visible {
        color: var(--green);
      }
    }

    .arrow {
      color: var(--green);
    }

    .company {
      color: var(--slate);
      font-size: var(--fz-xxs);
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

// Les id sont publics : le README de profil GitHub pointe vers https://enoal.fr/#tech-rust.
// Ils sont écrits en dur pour qu'un changement de libellé ne casse pas ces liens.
// `match` liste les valeurs des champs `tech:` des projets qui comptent pour la techno.
const SKILLS = [
  { id: 'tech-typescript', label: 'TypeScript', match: ['TypeScript'] },
  { id: 'tech-javascript', label: 'JavaScript', match: ['JavaScript'] },
  { id: 'tech-react', label: 'React', match: ['React'] },
  { id: 'tech-nodejs', label: 'Node.js', match: ['Node.js'] },
  { id: 'tech-nestjs', label: 'NestJS', match: ['NestJS'] },
  { id: 'tech-express', label: 'Express', match: ['Express'] },
  { id: 'tech-python', label: 'Python', match: ['Python'] },
  { id: 'tech-rust', label: 'Rust', match: ['Rust'] },
  { id: 'tech-c-cpp', label: 'C/C++', match: ['C', 'C++'] },
  { id: 'tech-git', label: 'Git', match: ['Git'] },
  { id: 'tech-linux', label: 'Linux', match: ['Linux'] },
  { id: 'tech-docker', label: 'Docker', match: ['Docker'] },
  { id: 'tech-kubernetes', label: 'Kubernetes', match: ['Kubernetes', 'K3s'] },
  { id: 'tech-ansible', label: 'Ansible', match: ['Ansible'] },
  { id: 'tech-postgresql', label: 'PostgreSQL', match: ['PostgreSQL'] },
];

const About = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/projects/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              title
              tech
              github
              external
              company
            }
          }
        }
      }
    }
  `);

  const { t, language } = useI18next();
  const [panel, setPanel] = useState({ id: null, open: false });
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Arrivé par un lien #tech-…, le navigateur a déjà défilé jusqu'ici avant que
    // ScrollReveal démarre : il ne verrait jamais la section entrer à l'écran et la
    // laisserait invisible. Le visiteur est déjà sur place, pas besoin d'animation.
    const arrivedOnSkill = SKILLS.some(({ id }) => `#${id}` === window.location.hash);
    if (prefersReducedMotion || arrivedOnSkill) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  // layout.js fait déjà défiler jusqu'au bouton visé par l'ancre et lui donne le focus :
  // il reste à ouvrir son panneau. window n'existe pas au build, d'où l'effet.
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.substring(1);
      if (SKILLS.some(skill => skill.id === id)) {
        setPanel({ id, open: true });
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  const allProjects = localizeEdges(data.projects.edges, language).map(
    ({ node }) => node.frontmatter,
  );
  const skills = SKILLS.map(skill => ({
    ...skill,
    projects: allProjects.filter(
      ({ tech }) => tech && tech.some(name => skill.match.includes(name)),
    ),
  }));
  // Le contenu reste celui de la dernière techno ouverte pendant le repli du panneau.
  const shownSkill = skills.find(({ id }) => id === panel.id);

  const toggleSkill = id =>
    setPanel(current => ({ id, open: !(current.open && current.id === id) }));

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
            {skills.map(({ id, label, projects }) => (
              <li key={id}>
                <button
                  type="button"
                  id={id}
                  aria-expanded={panel.open && panel.id === id}
                  aria-controls="tech-panel"
                  data-scroll-block="center"
                  onClick={() => toggleSkill(id)}>
                  {label} <span className="count">({projects.length})</span>
                </button>
              </li>
            ))}
          </ul>

          <div
            id="tech-panel"
            className={`tech-panel${panel.open ? ' open' : ''}`}
            role="region"
            aria-labelledby={panel.id || undefined}
            aria-live="polite">
            <div className="tech-panel-inner">
              {shownSkill && (
                <div className="tech-panel-box">
                  <p className="tech-panel-skill">{shownSkill.label}</p>
                  <p className="tech-panel-title">{t('about.usedIn')}</p>
                  <ul>
                    {shownSkill.projects.map(({ title, company, github, external }) => {
                      const href = github || external;

                      return (
                        <li key={title}>
                          {href ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              data-umami-event="project-click"
                              data-umami-event-project={title}
                              data-umami-event-section="about"
                              data-umami-event-target={github ? 'github' : 'external'}>
                              {title}
                              <span className="arrow" aria-hidden="true">
                                ↗
                              </span>
                            </a>
                          ) : (
                            <span className="title">{title}</span>
                          )}
                          {company && <span className="company">{company}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
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
