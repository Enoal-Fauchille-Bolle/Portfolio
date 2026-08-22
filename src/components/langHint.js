import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Link,
  useI18next,
  translate,
  detectLanguage,
  isLangHintDismissed,
  dismissLangHint,
} from '@i18n';

/* Le centrage passe par une translation : l'animation doit la reprendre, sans quoi la
   carte partirait du bord gauche au lieu de monter. */
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

const StyledLangHint = styled.aside`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 15px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);

  /* Sous le panneau du menu mobile (9) et sous les barres latérales (10) : la carte ne
     doit jamais passer par-dessus le menu ouvert. Le centre-bas est le seul couloir que
     Social et Email laissent libre. */
  z-index: 8;

  width: calc(100% - 40px);
  max-width: 480px;
  padding: 20px;
  background-color: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px -15px var(--navy-shadow);

  @media (prefers-reduced-motion: no-preference) {
    animation: ${slideUp} 300ms var(--easing);
  }

  .message {
    margin: 0;
    color: var(--light-slate);
    font-size: var(--fz-lg);
    line-height: 1.4;
  }

  .action {
    ${({ theme }) => theme.mixins.smallButton};
    grid-column: 1 / -1;
    justify-self: start;
  }

  .dismiss {
    ${({ theme }) => theme.mixins.flexCenter};
    width: 24px;
    height: 24px;
    padding: 0;
    color: var(--light-slate);
    background-color: transparent;
    border-radius: var(--border-radius);
    font-family: var(--font-mono);
    font-size: var(--fz-xl);
    line-height: 1;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--green);
    }
  }
`;

// Suggère la langue du navigateur quand elle diffère de celle de la page — et se contente
// de la suggérer : `src/i18n/config.js` interdit toute redirection automatique, `enoal.fr`
// doit vouloir dire la même chose pour tout le monde.
//
// Le texte est rendu dans la langue *suggérée*, pas dans celle de la page : un bandeau en
// français destiné à quelqu'un dont le navigateur dit qu'il ne lit pas le français
// raterait sa cible. D'où `translate(suggested)` plutôt que le `t` du contexte.
const LangHint = () => {
  const { language, originalPath } = useI18next();
  const [suggested, setSuggested] = useState(null);

  // Rien au premier rendu. nginx sert le même HTML à tout le monde, sans négociation de
  // contenu : la langue du navigateur n'est connue qu'ici, et décider dès le rendu initial
  // ferait diverger l'arbre React du HTML généré.
  //
  // L'effet couvre aussi le cas « rien à suggérer » au lieu de sortir tôt : `/` et `/en/`
  // sortent du même modèle de page, React peut donc réutiliser l'instance et se contenter
  // de changer `language`. Une sortie anticipée laisserait `suggested` figé sur la valeur
  // du rendu précédent — le bandeau proposerait l'anglais depuis la page anglaise.
  useEffect(() => {
    if (isLangHintDismissed()) {
      setSuggested(null);
      return;
    }

    const detected = detectLanguage();

    setSuggested(detected && detected !== language ? detected : null);
  }, [language]);

  if (!suggested) {
    return null;
  }

  const t = translate(suggested);

  const dismiss = () => {
    dismissLangHint();
    setSuggested(null);
  };

  return (
    // `lang` n'est pas décoratif : sans lui, un lecteur d'écran prononcerait le texte
    // anglais avec la voix française héritée du <html lang>. `role="status"` implique déjà
    // aria-live="polite", inutile de le doubler.
    <StyledLangHint lang={suggested} role="status">
      <p className="message">{t('langHint.message')}</p>

      <button
        type="button"
        className="dismiss"
        onClick={dismiss}
        aria-label={t('langHint.dismiss')}
        data-umami-event="lang-hint-dismiss">
        ×
      </button>

      <Link
        to={originalPath}
        language={suggested}
        className="action"
        onClick={dismissLangHint}
        data-umami-event="lang-hint-accept"
        data-umami-event-language={suggested}>
        {t('langHint.action')}
      </Link>
    </StyledLangHint>
  );
};

export default LangHint;
