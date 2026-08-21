import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 10px;
    color: var(--light-slate);
  }

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1;

  a {
    padding: 10px;
  }

  .github-stats {
    margin-top: 10px;

    & > span {
      display: inline-flex;
      align-items: center;
      margin: 0 7px;
    }
    svg {
      display: inline-block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
  }
`;

const Footer = () => {
  const { t } = useI18next();

  return (
    <StyledFooter>
      <StyledSocialLinks>
        <ul>
          {socialMedia &&
            socialMedia.map(({ name, url }, i) => (
              <li key={i}>
                <a
                  href={url}
                  aria-label={name}
                  data-umami-event="contact-click"
                  data-umami-event-channel={name}
                  data-umami-event-source="footer">
                  <Icon name={name} />
                </a>
              </li>
            ))}
        </ul>
      </StyledSocialLinks>

      <StyledCredit tabindex="-1">
        <div>
          <a
            href="https://github.com/bchiang7/v4"
            data-umami-event="outbound-click"
            data-umami-event-destination="bchiang7-v4"
            data-umami-event-source="footer">
            {t('footer.design')}
          </a>
        </div>
        <div style={{ marginTop: '5px' }}>{t('footer.refactor')}</div>
      </StyledCredit>
    </StyledFooter>
  );
};

Footer.propTypes = {
  githubInfo: PropTypes.object,
};

export default Footer;
