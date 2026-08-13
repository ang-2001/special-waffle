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
    // Sourced from period blank-tape packaging red, not invented. Used by
    // RecDot; also reserved as the default for a future error/destructive
    // UI treatment.
    recRed: '#e1202d',
    // Color-bar stripe from classic blank-tape box art (Memorex/TDK-style
    // rainbow spine). Decorative accent only — used sparingly as a hover
    // sweep, never as a base UI color. red/orange/blue reuse recRed/gold/
    // link.default so the stripe stays tied to colors already in the system.
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
  // Compact elements: controls like IconButton, and small inline badges
  // (TapeLabel, Readout, ChatListItem's name pill) — anything short enough
  // that md's radius would look disproportionately round on it.
  sm: '8px',
  // The shared radius for taller content surfaces: input fields, list
  // rows, message bubbles, search/compose inputs. Deliberately singular —
  // these converge here rather than drifting per-component; round buttons
  // use 50% directly, not this scale.
  md: '10px',
};

export const transitions = {
  fast: '100ms',
  base: '120ms',
  // Deliberately slower — a visible sweep, not a snap (see ButtonDark's
  // rainbow-stripe hover).
  sweep: '450ms',
};
