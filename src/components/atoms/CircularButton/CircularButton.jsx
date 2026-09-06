import styled from 'styled-components';
import { ButtonDark } from '../ButtonDark/ButtonDark';

// Circular tactile variant of ButtonDark — same beveled/gradient hardware
// look as IconButton's square variant, just round. 48px to match
// LogoutButton's size: both are single standalone circular actions (not
// paired/grouped like IconButton), and Send is used far more frequently
// than Logout, so it doesn't make sense for it to be the smaller of the
// two. LogoutButton has its own local circular variant and is left as-is,
// not migrated to share this atom.
export const CircularButton = styled(ButtonDark)`
    width: 48px;
    aspect-ratio: 1;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

export default CircularButton;
