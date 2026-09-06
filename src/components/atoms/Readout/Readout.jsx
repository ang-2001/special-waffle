import styled from 'styled-components';

export const Readout = styled.span`
    display: inline-flex;
    align-items: center;
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors.readout.text};
    background-color: ${({ theme }) => theme.colors.readout.background};
    padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.radii.sm};
    text-shadow: 0 0 6px ${({ theme }) => theme.colors.readout.text};
`;

export default Readout;
