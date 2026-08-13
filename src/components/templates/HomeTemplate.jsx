import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Sidebar from '../organisms/Sidebar/Sidebar';
import MessageSection from '../organisms/MessageSection/MessageSection';

const fadeUp = keyframes`
    0% { opacity: 0; transform: translateY(16px); }
    100% { opacity: 1; transform: translateY(0); }
`;

// Plays once on mount — covers the login/register "tape insert" hand-off,
// but also fires on a plain page refresh/direct nav to /home.
const HomePageContainer = styled.div`
    height: 100%;
    display: flex;
    animation: ${fadeUp} 400ms ease-out;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }

    /* Sidebar and message pane can never both be on screen below this width
       — which one shows depends on whether a conversation is selected. */
    @media (max-width: 768px) {
        & > *:first-child {
            display: ${({ $hasSelection }) => ($hasSelection ? 'none' : 'flex')};
        }
        & > *:last-child {
            display: ${({ $hasSelection }) => ($hasSelection ? 'flex' : 'none')};
        }
    }
`;

const HomeTemplate = () => {
    const [selectedFriend, setSelectedFriend] = useState(null);

    return (
        <HomePageContainer $hasSelection={Boolean(selectedFriend)}>
            <Sidebar selectedFriend={selectedFriend} onSelectFriend={setSelectedFriend} />
            <MessageSection friend={selectedFriend} onBack={() => setSelectedFriend(null)} />
        </HomePageContainer>
    );
};

export default HomeTemplate;
