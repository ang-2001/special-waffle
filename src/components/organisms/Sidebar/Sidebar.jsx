import React from 'react'
import styled from 'styled-components';
import { Heading } from '../../atoms/Heading/Heading';
import { ChromaHover } from '../../atoms/ChromaHover/ChromaHover';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { AddFriendIcon } from '../../atoms/AddFriendIcon/AddFriendIcon';
import { RequestsIcon } from '../../atoms/RequestsIcon/RequestsIcon';
import { SearchField } from '../../molecules/SearchField/SearchField';
import { ChatListItem } from '../../molecules/ChatListItem/ChatListItem';
import { UserRow } from '../../molecules/UserRow/UserRow';

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

// Placeholder friend list — no backend/data layer exists yet anywhere in the
// app, so every organism at this stage (LoginForm, RegisterForm) is
// self-contained rather than prop-driven.
const FRIENDS = [
    { name: 'Big Beeg', preview: 'rewind that last part lol' },
    { name: "Study Grp '99", preview: 'Nadia: meeting moved to 6' },
    { name: 'VHS Club', preview: 'found a mint copy of Tron' },
    { name: 'Mom', preview: 'call me when you land' },
];

const Sidebar = ({ selectedFriend, onSelectFriend }) => {
  return (
    <SideBarContainer>
      <SidebarHeader>
        <ChromaHover>
          <Heading variant="section">Waffler</Heading>
        </ChromaHover>
        <SidebarActions>
          <IconButton type="button" aria-label="Add friend">
            <AddFriendIcon />
          </IconButton>
          <IconButton type="button" aria-label="Friend requests">
            <RequestsIcon />
          </IconButton>
        </SidebarActions>
      </SidebarHeader>
      <SidebarSearch>
        <SearchField />
      </SidebarSearch>
      <ChatList>
        {FRIENDS.map(({ name, preview }) => (
          <ChatListItem
            key={name}
            name={name}
            preview={preview}
            active={name === selectedFriend}
            onClick={() => onSelectFriend(name)}
          />
        ))}
      </ChatList>
      <UserRow name="Kyle" />
    </SideBarContainer>
  )
}

export default Sidebar
