import styled, { css } from 'styled-components';

// Merges the pre-reorg PageHeader and SectionHeader styled-components into one
// atom — they differed only in font-size/use-case (see plan decisions).
const variants = {
  page: css`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  `,
  section: css`
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `,
};

export const Heading = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.displayBold};
    color: ${({ theme }) => theme.colors.background.surfaceAlt};
    ${({ variant = 'page' }) => variants[variant]}
`;

export default Heading;
