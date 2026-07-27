import styled from 'styled-components';

export const InputContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.background.surfaceAlt};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radii.sm};
    width: 100%;
    box-sizing: border-box;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    transition: all ${({ theme }) => theme.transitions.base} ease-in-out;
    &:focus-within {
        border-left: 8px solid ${({ theme }) => theme.colors.accent.gold};
    }
`;

export default InputContainer;
