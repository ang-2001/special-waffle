// Design tokens: single source of truth for colors, typography, spacing, radii, transitions.
// Values are extracted from the pre-reorg src/utils/styles/index.styled.js, index.module.css,
// and index.css. Where noted, a value is carried over verbatim pending a follow-up decision.

export const colors = {
  background: {
    page: '#2f2f2f',
    surface: '#252525',
    surfaceAlt: '#f4efdc',
  },
  text: {
    onSurfaceAlt: '#4a3425',
    onDark: '#eecf96',
    inverse: '#fff',
    default: '#000',
  },
  accent: {
    gold: '#fdb604',
    teal: '#8ccbb7',
    beige: '#d1cdbd',
    beigeShadow: '#ebd9b3',
  },
  neutralDark: {
    100: '#444',
    300: '#252525',
    400: '#1c1c1c',
    500: '#171717',
    // TODO: near-duplicate of 500 (#171717), used only for ButtonDark's border.
    // Carried over verbatim rather than silently merged.
    600: '#090909',
    highlight: '#7d7c7e',
  },
  link: {
    // TODO: confirm intended relationship between these two — the original
    // `text-shadow: 1px #0277f5` is missing offset-y/blur so it likely renders
    // no visible shadow today. Carried over verbatim.
    default: '#4493ea',
    shadow: '#0277f5',
  },
};

export const typography = {
  fontFamily: {
    display: "'vhs', sans-serif",
    displayBold: "'vhs-bold', sans-serif",
    body: "'Inter', sans-serif",
  },
  fontSize: {
    sm: '18px',
    md: '24px',
    // TODO: only relative unit in the scale (resolves off the browser default
    // font-size since no ancestor sets one). Carried over verbatim.
    lg: '2em',
    xl: '50px',
  },
};

export const spacing = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  // TODO: breaks the otherwise 4/8-multiple rhythm above. Carried over verbatim.
  buttonY: '25px',
  // TODO: falls between md(16px) and lg(24px) in the scale above, used only for
  // the form card's vertical padding. Carried over verbatim for exact parity.
  formPaddingY: '20px',
};

export const radii = {
  sm: '8px',
  md: '10px',
};

export const transitions = {
  fast: '100ms',
  base: '120ms',
};
