import styled from 'styled-components';

export const Label = styled.label`
    display: block;
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-weight: bold;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin: ${({ theme }) => theme.spacing.xxs} 0;
`;

export default Label;
