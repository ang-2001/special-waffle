import styled from 'styled-components';

// Placeholder standing in for RegisterForm's real submit button (see the
// commented-out Button call there). Kept as its own atom rather than merged
// into Button until real submit logic is restored — see plan non-goals.
export const ButtonDark = styled.button`
    width: 100%;
    outline: none;
    border: 4px ${({ theme }) => theme.colors.neutralDark[600]} solid;
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.spacing.buttonY} 0;
    margin: ${({ theme }) => theme.spacing.sm} 0;
    background: linear-gradient(
        145deg,
        ${({ theme }) => theme.colors.neutralDark[500]},
        ${({ theme }) => theme.colors.neutralDark[100]}
    );
    box-shadow: inset 2px 2px 0px ${({ theme }) => theme.colors.neutralDark.highlight},
        inset -2px -2px 0px ${({ theme }) => theme.colors.neutralDark[400]};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    &:hover {
        border-color: ${({ theme }) => theme.colors.neutralDark[500]};
        background: ${({ theme }) => theme.colors.background.surface};
    }
    &:focus {
        border-color: ${({ theme }) => theme.colors.neutralDark[500]};
        background: ${({ theme }) => theme.colors.background.surface};
    }
    &:active {
        border-color: ${({ theme }) => theme.colors.neutralDark[500]};
        transform: translateY(2px);
    }
`;

export default ButtonDark;
