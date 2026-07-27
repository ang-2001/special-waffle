import styled from 'styled-components';

export const Input = styled.input`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    outline: none;
    border: none;
    background-color: inherit;
    color: ${({ theme }) => theme.colors.text.default};
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: ${({ theme }) => theme.spacing.xxs} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.accent.beige};
`;

export default Input;
