import styled from 'styled-components';
import { Link } from 'react-router';

// Replaces the .pageLink CSS-module class as part of consolidating onto
// styled-components (see plan decisions).
export const PageLink = styled(Link)`
    color: ${({ theme }) => theme.colors.link.default};
    text-decoration: none;
    text-shadow: 0 0 6px ${({ theme }) => theme.colors.link.shadow};
    &:hover {
        text-decoration: underline;
    }
`;

export default PageLink;
