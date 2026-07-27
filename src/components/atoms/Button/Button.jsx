import styled from 'styled-components';

export const Button = styled.button`
    width: 100%;
    outline: none;
    background-color: ${({ theme }) => theme.colors.accent.teal};
    color: ${({ theme }) => theme.colors.background.surfaceAlt};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: bold;
    letter-spacing: 0.1em;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 2px solid transparent;
    padding: ${({ theme }) => theme.spacing.buttonY} 0;
    margin-top: ${({ theme }) => theme.spacing.xs};
    transition: ${({ theme }) => theme.transitions.fast} background-color ease;
    &:hover {
        background-color: ${({ theme }) => theme.colors.accent.gold};
    }
    &:active {
        background-color: ${({ theme }) => theme.colors.accent.gold};
        box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.accent.beigeShadow};
    }
    &:focus {
        background-color: ${({ theme }) => theme.colors.accent.gold};
    }
`;

export default Button;
