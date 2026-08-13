import styled from 'styled-components';
import { ButtonDark } from '../ButtonDark/ButtonDark';
import { PowerIcon } from '../PowerIcon/PowerIcon';

// Circular variant of ButtonDark, carried over from the pre-reorg
// messaging-page work (main-page branch) where it sat in the Sidebar.
const CircularButtonDark = styled(ButtonDark)`
    width: 48px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 0;
    margin: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

export const LogoutButton = (props) => (
    <CircularButtonDark type="button" aria-label="Log out" {...props}>
        <PowerIcon width="20px" height="20px" />
    </CircularButtonDark>
);

export default LogoutButton;
