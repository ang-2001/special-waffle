import styled from 'styled-components';

export const TapeLabel = styled.span`
    display: inline-block;
    font-family: ${({ theme }) => theme.typography.fontFamily.handwriting};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
    background-color: ${({ theme }) => theme.colors.accent.beige};
    padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.sm};
    border: 1px dashed ${({ theme }) => theme.colors.text.onSurfaceAlt};
    border-radius: ${({ theme }) => theme.radii.sm};
    transform: rotate(-1.5deg);
`;

export default TapeLabel;
