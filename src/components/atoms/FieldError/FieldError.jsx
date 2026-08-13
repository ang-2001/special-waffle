import styled from 'styled-components';

export const FieldError = styled.span`
    display: block;
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.accent.recRed};
    margin-top: ${({ theme }) => theme.spacing.xxs};
`;

export default FieldError;
