import styled from 'styled-components';
import { Input } from '../../atoms/Input/Input';

const SearchFieldContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.background.surfaceAlt};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radii.md};
    width: 100%;
    box-sizing: border-box;
`;

const SearchInput = styled(Input)`
    border-bottom: none;
    margin: 0;
`;

export const SearchField = (props) => (
    <SearchFieldContainer>
        <SearchInput type="search" placeholder="Search" {...props} />
    </SearchFieldContainer>
);

export default SearchField;
