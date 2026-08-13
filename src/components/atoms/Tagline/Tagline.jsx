import styled from 'styled-components';

export const Tagline = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    max-width: 460px;
    margin: ${({ theme }) => theme.spacing.md} auto 0;
    text-align: center;

    @media (max-width: 480px) {
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
`;

export default Tagline;
