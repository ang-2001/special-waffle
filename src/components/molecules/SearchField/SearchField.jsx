import styled from 'styled-components';
import { Input } from '../../atoms/Input/Input';

// Doesn't reuse InputContainer (different padding/width), but picks up the same hover/focus-within treatment.
const SearchFieldContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.background.surfaceAlt};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radii.md};
    width: 100%;
    box-sizing: border-box;
    transition: all ${({ theme }) => theme.transitions.base} ease-in-out;

    &:hover {
        background-color: ${({ theme }) => theme.colors.accent.beigeShadow};
    }
    &:focus-within {
        border-left: 8px solid ${({ theme }) => theme.colors.accent.gold};
    }
`;

// Compact body size, shared by the sidebar's other pill inputs.
const SearchInput = styled(Input)`
    border-bottom: none;
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.body};
`;

export const SearchField = (props) => (
    <SearchFieldContainer>
        <SearchInput type="search" placeholder="Search" {...props} />
    </SearchFieldContainer>
);

export default SearchField;
