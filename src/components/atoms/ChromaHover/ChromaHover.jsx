import styled, { css, keyframes } from 'styled-components';
import { colors } from '../../../theme/tokens';

const flicker = keyframes`
    0% { text-shadow: 2px 0 ${colors.accent.recRed}, -2px 0 ${colors.readout.text}; }
    50% { text-shadow: -2px 0 ${colors.accent.recRed}, 2px 0 ${colors.readout.text}; }
    100% { text-shadow: none; }
`;

// Shared hover-flicker mixin so components that already own their hover
// state (e.g. Message's own-bubble) can splice this in directly instead of
// wrapping in <ChromaHover>.
export const chromaHoverMixin = css`
    &:hover {
        animation: ${flicker} 220ms steps(2) 2;
    }

    @media (prefers-reduced-motion: reduce) {
        &:hover {
            animation: none;
        }
    }
`;

// Chroma-split hover flicker — brief CRT-style color-fringing glitch on
// hover. text-shadow inherits, so wrapping any text content works.
export const ChromaHover = styled.span`
    display: inline-block;
    ${chromaHoverMixin}
`;

export default ChromaHover;
