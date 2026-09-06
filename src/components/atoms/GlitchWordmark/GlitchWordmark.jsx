import styled from 'styled-components';

// Static chromatic-aberration split — the Landing hero's wordmark treatment.
// Distinct from Heading's page/section roles, which don't carry this effect.
export const GlitchWordmark = styled.h1`
    font-family: ${({ theme }) => theme.typography.fontFamily.displayBold};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.inverse};
    text-shadow: 2px 0 ${({ theme }) => theme.colors.accent.recRed},
        -2px 0 ${({ theme }) => theme.colors.readout.text};
    margin: 0;

    @media (max-width: 480px) {
        font-size: ${({ theme }) => theme.typography.fontSize.lg};
    }
`;

export default GlitchWordmark;
