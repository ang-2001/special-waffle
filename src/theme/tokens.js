// Design tokens: single source of truth for colors, typography, spacing, radii, transitions.

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
    // Hover tint for surfaceAlt fields (inputs, pills).
    beigeShadow: '#e2ddd0',
    // Used by RecDot; also the default for error/destructive UI.
    recRed: '#e1202d',
    // Decorative hover-sweep accent only. Reuses recRed/gold/link.default.
    rainbow: ['#e1202d', '#fdb604', '#f6e05e', '#3fa66b', '#4493ea', '#9b6fd1'],
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
  // VFD-style counter/readout glow.
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
    // Secondary/supporting text: previews, statuses, hints, timestamps.
    caption: '12px',
    // Conversational content and label-less "pill" inputs (compose,
    // search, add friend). sm below is for labeled form fields instead.
    body: '14px',
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
  // Compact controls and small inline badges (IconButton, TapeLabel, etc).
  sm: '8px',
  // Taller content surfaces: inputs, list rows, bubbles. Round buttons use 50%, not this scale.
  md: '10px',
};

export const transitions = {
  fast: '100ms',
  base: '120ms',
  // Deliberately slower — a visible sweep, not a snap (see ButtonDark's
  // rainbow-stripe hover).
  sweep: '450ms',
};
