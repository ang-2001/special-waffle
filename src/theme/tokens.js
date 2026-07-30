// Design tokens: single source of truth for colors, typography, spacing, radii, transitions.
// Values are extracted from the pre-reorg src/utils/styles/index.styled.js, index.module.css,
// and index.css.

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
    beige: '#d1cdbd',
    beigeShadow: '#ebd9b3',
    // Reserved for a future error/destructive-action UI (no consumer yet).
    // Sourced from period blank-tape packaging red, not invented.
    recRed: '#e1202d',
  },
  neutralDark: {
    100: '#444',
    300: '#252525',
    400: '#1c1c1c',
    500: '#171717',
    highlight: '#7d7c7e',
  },
  link: {
    default: '#4493ea',
    shadow: '#0277f5',
  },
  // VFD-style counter/readout glow (teal, not red — real VCR displays were
  // vacuum fluorescent, not LED). Reserved for a future timestamp/counter UI.
  readout: {
    text: '#4dd9c4',
    background: '#0e1a18',
  },
};

export const typography = {
  fontFamily: {
    display: "'vhs', sans-serif",
    displayBold: "'vhs-bold', sans-serif",
    body: "'Inter', sans-serif",
    // VT323: pixelated LCD/CRT-style digits, for the readout color above
    // (a counter/timestamp display, not prose).
    mono: "'VT323', 'Courier New', monospace",
    // Permanent Marker: for a handwritten cassette-label treatment.
    handwriting: "'Permanent Marker', cursive",
  },
  fontSize: {
    sm: '18px',
    md: '24px',
    lg: '32px',
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
