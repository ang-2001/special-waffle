import styled from 'styled-components';
import { ButtonDark } from '../ButtonDark/ButtonDark';

// Square sibling of LogoutButton's circular variant, sized for a pair of
// small header actions (e.g. Sidebar's add-friend/requests icons) rather
// than a single bottom-bar action.
export const IconButton = styled(ButtonDark)`
    width: 40px;
    height: 40px;
    padding: 0;
    margin: 0;
    border-radius: ${({ theme }) => theme.radii.sm};
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

export default IconButton;
