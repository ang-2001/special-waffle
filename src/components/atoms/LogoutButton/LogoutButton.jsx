import styled from 'styled-components';
import { ButtonDark } from '../ButtonDark/ButtonDark';
import { PowerIcon } from '../PowerIcon/PowerIcon';
import { useAuth } from '../../../hooks/useAuth';

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

// RequireAuth handles the actual redirect once the session clears — this
// only needs to fire signOut and let AuthContext's own state change ripple
// through, not navigate anywhere itself.
export const LogoutButton = (props) => {
    const { signOut } = useAuth();

    return (
        <CircularButtonDark type="button" aria-label="Log out" {...props} onClick={() => signOut()}>
            <PowerIcon width="20px" height="20px" />
        </CircularButtonDark>
    );
};

export default LogoutButton;
