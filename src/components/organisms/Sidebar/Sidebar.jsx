import React, { useState } from 'react'
import styled, { css, keyframes } from 'styled-components';
import { Heading } from '../../atoms/Heading/Heading';
import { ChromaHover } from '../../atoms/ChromaHover/ChromaHover';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { AddFriendIcon } from '../../atoms/AddFriendIcon/AddFriendIcon';
import { RequestsIcon } from '../../atoms/RequestsIcon/RequestsIcon';
import { SearchField } from '../../molecules/SearchField/SearchField';
import { ChatListItem } from '../../molecules/ChatListItem/ChatListItem';
import { UserRow } from '../../molecules/UserRow/UserRow';
import { AddFriendPanel } from '../../molecules/AddFriendPanel/AddFriendPanel';
import { RequestsPanel } from '../../molecules/RequestsPanel/RequestsPanel';
import { useEjectTransition } from '../../../hooks/useEjectTransition';

const SWAP_EJECT_MS = 260;
const SWAP_INSERT_MS = 280;

const eject = keyframes`
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(22px) scale(0.97); opacity: 0; }
`;

const insert = keyframes`
    0% { transform: translateY(-14px) scale(0.97); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
`;

const SideBarContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.background.surface};
    color: ${({ theme }) => theme.colors.text.default};
    height: 100%;
    width: 300px;
    flex: none;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

// Wraps whichever view is showing (chat list / add-friend / requests) so
// switching between them plays a tape-swap: the outgoing pane ejects
// (driven by $ejecting from useEjectTransition), then the incoming pane —
// a fresh mount, since it's a different view — plays its insert animation
// automatically. UserRow's footer lives outside this and never moves.
const SwapPane = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    animation-name: ${insert};
    animation-duration: ${SWAP_INSERT_MS}ms;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    animation-fill-mode: forwards;

    ${({ $ejecting }) => $ejecting && css`
        animation-name: ${eject};
        animation-duration: ${SWAP_EJECT_MS}ms;
        animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    `}

    @media (prefers-reduced-motion: reduce) {
        animation: none !important;
    }
`;

const SidebarHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.md};
`;

const SidebarActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const SidebarSearch = styled.div`
    padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
`;

const ChatList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: 0 ${({ theme }) => theme.spacing.md};
    overflow-y: auto;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.accent.beige} ${({ theme }) => theme.colors.background.surface};
`;

const INITIAL_REQUESTS = [
    { id: 1, name: 'Nadia' },
    { id: 2, name: 'Theo' },
];

const Sidebar = ({ friends, selectedFriend, onSelectFriend, onAcceptFriend }) => {
  const [view, setView] = useState('list');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [swapping, runSwap] = useEjectTransition(SWAP_EJECT_MS);

  const swapTo = (nextView) => {
    if (nextView === view || swapping) return;
    runSwap(() => setView(nextView));
  };

  const handleAccept = (id, name) => {
    setRequests((prev) => prev.filter((request) => request.id !== id));
    onAcceptFriend(name);
  };
  const handleDecline = (id) => setRequests((prev) => prev.filter((request) => request.id !== id));

  return (
    <SideBarContainer>
      <SwapPane $ejecting={swapping}>
        {view === 'list' && (
          <>
            <SidebarHeader>
              <ChromaHover>
                <Heading variant="section">Waffler</Heading>
              </ChromaHover>
              <SidebarActions>
                <IconButton type="button" aria-label="Add friend" onClick={() => swapTo('addFriend')}>
                  <AddFriendIcon />
                </IconButton>
                <IconButton type="button" aria-label="Friend requests" onClick={() => swapTo('requests')}>
                  <RequestsIcon />
                </IconButton>
              </SidebarActions>
            </SidebarHeader>
            <SidebarSearch>
              <SearchField />
            </SidebarSearch>
            <ChatList>
              {friends.map(({ name, preview }) => (
                <ChatListItem
                  key={name}
                  name={name}
                  preview={preview}
                  active={name === selectedFriend}
                  onClick={() => onSelectFriend(name)}
                />
              ))}
            </ChatList>
          </>
        )}
        {view === 'addFriend' && <AddFriendPanel onBack={() => swapTo('list')} />}
        {view === 'requests' && (
          <RequestsPanel
            requests={requests}
            onBack={() => swapTo('list')}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        )}
      </SwapPane>
      <UserRow name="Kyle" />
    </SideBarContainer>
  )
}

export default Sidebar
