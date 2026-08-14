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

// Placeholder friend list — no backend/data layer exists yet anywhere in the
// app. Lives here (not in Sidebar) so accepting a friend request can add to
// it and have MessageSection pick up the new friend too.
const INITIAL_FRIENDS = [
    { name: 'Big Beeg', preview: 'rewind that last part lol' },
    { name: "Study Grp '99", preview: 'Nadia: meeting moved to 6' },
    { name: 'VHS Club', preview: 'found a mint copy of Tron' },
    { name: 'Mom', preview: 'call me when you land' },
];

const HomeTemplate = () => {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [friends, setFriends] = useState(INITIAL_FRIENDS);

    const handleAcceptFriend = (name) => {
        setFriends((prev) => (prev.some((friend) => friend.name === name) ? prev : [...prev, { name }]));
    };

    return (
        <HomePageContainer $hasSelection={Boolean(selectedFriend)}>
            <Sidebar
                friends={friends}
                selectedFriend={selectedFriend}
                onSelectFriend={setSelectedFriend}
                onAcceptFriend={handleAcceptFriend}
            />
            <MessageSection friend={selectedFriend} onBack={() => setSelectedFriend(null)} />
        </HomePageContainer>
    );
};

export default HomeTemplate;
