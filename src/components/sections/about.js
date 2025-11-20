import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
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
    'Angular',
    'Node.js',
    'Express',
    'NestJS',
    'Python',
    'Docker',
    'Git',
    'PostgreSQL',
    'C/C++',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">À propos</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Bonjour ! Je suis étudiant en 3ème année à{' '}
              <a href="https://www.epitech.eu/" target="_blank" rel="noreferrer">
                Epitech Nantes
              </a>
              {' '}(Promo 2028), en formation Expert en Informatique (RNCP Niveau 7).
              Passionné par le développement web et logiciel, je conçois des solutions robustes
              et modernes.
            </p>

            <p>
              J'ai eu l'opportunité de développer mes compétences lors de plusieurs expériences,
              notamment chez{' '}
              <a href="https://revolte.club/" target="_blank" rel="noreferrer">
                Revolte E-garages
              </a>
              {' '}où j'ai contribué au développement d'une plateforme full-stack dédiée aux
              garagistes. Je suis également impliqué dans des initiatives bénévoles comme{' '}
              <a href="https://www.helloasso.com/associations/reso2d/" target="_blank" rel="noreferrer">
                RESO2D
              </a>
              {' '}(Green IT) et le DevFest Nantes.
            </p>

            <p>
              Mes soft skills : <strong>Rigoureux</strong>, <strong>Consciencieux</strong>,{' '}
              <strong>Autonome</strong>, <strong>Curieux</strong>,{' '}
              <strong>Créatif</strong>, et <strong>Collaboratif</strong>.
            </p>

            <p>Voici quelques technologies avec lesquelles je travaille actuellement :</p>
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
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Photo de profil Enoal Fauchille"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
