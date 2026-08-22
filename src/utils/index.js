export const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const navDelay = 100;
// Durée de l’entrée en fondu : délai avant le montage des barres latérales,
// et timeout des CSSTransition de Hero, Nav et Side.
export const revealDelay = 500;

export const KEY_CODES = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_LEFT_IE11: 'Left',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_RIGHT_IE11: 'Right',
  ARROW_UP: 'ArrowUp',
  ARROW_UP_IE11: 'Up',
  ARROW_DOWN: 'ArrowDown',
  ARROW_DOWN_IE11: 'Down',
  ESCAPE: 'Escape',
  ESCAPE_IE11: 'Esc',
  TAB: 'Tab',
  SPACE: ' ',
  SPACE_IE11: 'Spacebar',
  ENTER: 'Enter',
};

// Les fiches Markdown vivent par paires dans le même dossier : `Skylode.md` porte la
// version française, `Skylode.en.md` sa traduction. Ce choix garde intacts les chemins
// relatifs des images (`cover: './demo.png'`) et les filtres regex des requêtes.
//
// `useStaticQuery` n'accepte pas de variable, on ne peut donc pas filtrer par langue
// dans GraphQL : les deux langues arrivent ensemble et le tri se fait ici.
//
// Contrainte de nommage : un fichier de contenu ne doit pas contenir de point en
// dehors de son extension, sinon son nom serait pris pour un suffixe de langue.
const TRANSLATION_SUFFIX = /\.([a-z]{2})\.md$/;

const filePath = node => node.fileAbsolutePath || '';

// `content/projects/Skylode.en.md` -> `content/projects/Skylode.md`
const sourcePath = node => filePath(node).replace(TRANSLATION_SUFFIX, '.md');

export const localizeEdges = (edges, language) => {
  const translations = new Map();

  edges.forEach(edge => {
    const match = filePath(edge.node).match(TRANSLATION_SUFFIX);
    if (match) {
      translations.set(`${match[1]}:${sourcePath(edge.node)}`, edge);
    }
  });

  // On itère sur les fiches sources dans l'ordre déjà trié par GraphQL : les deux
  // langues affichent donc la même liste, dans le même ordre. Une fiche pas encore
  // traduite retombe sur sa version d'origine au lieu de disparaître.
  return edges
    .filter(({ node }) => !TRANSLATION_SUFFIX.test(filePath(node)))
    .map(edge => translations.get(`${language}:${filePath(edge.node)}`) || edge);
};
