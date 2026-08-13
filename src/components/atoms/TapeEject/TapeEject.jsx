import { css, keyframes } from 'styled-components';

export const TAPE_EJECT_MS = 360;

const eject = keyframes`
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(40px) scale(0.96); opacity: 0; }
`;

// Card "ejects" down like a tape being pushed into a slot — plays once,
// driven by the $ejecting prop, before the caller navigates away.
export const tapeEjectMixin = css`
    ${({ $ejecting }) => $ejecting && css`
        animation: ${eject} ${TAPE_EJECT_MS}ms ease-in forwards;
    `}

    @media (prefers-reduced-motion: reduce) {
        animation: none !important;
    }
`;

export default tapeEjectMixin;
