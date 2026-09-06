import styled, { keyframes } from 'styled-components';

const blink = keyframes`
    0%, 55% { opacity: 1; }
    56%, 100% { opacity: 0.15; }
`;

// Blinking record-indicator dot, paired with Readout in a conversation
// header. Freezes lit under prefers-reduced-motion rather than looping.
export const RecDot = styled.span`
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent.recRed};
    animation: ${blink} 1.6s steps(1) infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        opacity: 1;
    }
`;

export default RecDot;
