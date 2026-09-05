import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components';
import { Heading } from '../../atoms/Heading/Heading';
import { ChromaHover } from '../../atoms/ChromaHover/ChromaHover';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { AddFriendIcon } from '../../atoms/AddFriendIcon/AddFriendIcon';
import { RequestsIcon } from '../../atoms/RequestsIcon/RequestsIcon';
import { SearchField } from '../../molecules/SearchField/SearchField';
import { ChatListItem } from '../../molecules/ChatListItem/ChatListItem';
import { ChatListSkeleton } from '../../molecules/ChatListSkeleton/ChatListSkeleton';
import { NewChatRow } from '../../molecules/NewChatRow/NewChatRow';
import { UserRow } from '../../molecules/UserRow/UserRow';
import { AddFriendPanel } from '../../molecules/AddFriendPanel/AddFriendPanel';
import { RequestsPanel } from '../../molecules/RequestsPanel/RequestsPanel';
import { CreateChatPanel } from '../../molecules/CreateChatPanel/CreateChatPanel';
import { FieldError } from '../../atoms/FieldError/FieldError';
import { useEjectTransition } from '../../../hooks/useEjectTransition';
import { useAuth } from '../../../hooks/useAuth';
import { fetchIncomingRequests, respondToRequest, fetchFriends } from '../../../lib/friends';

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

// Wraps the current view — switching plays a tape-swap: outgoing pane
// ejects, then the fresh-mounted incoming pane plays its insert animation.
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

// Wraps a single header IconButton so a badge can be positioned relative to
// it without changing the shared IconButton atom itself (still a plain
// square icon everywhere else it's used).
const IconButtonSlot = styled.div`
    position: relative;
    display: inline-flex;
`;

const RequestBadge = styled.span`
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 999px;
    background-color: ${({ theme }) => theme.colors.accent.recRed};
    color: ${({ theme }) => theme.colors.text.inverse};
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.background.surface};
    pointer-events: none;
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

const ListMessage = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.lg};
`;

const ListHeadline = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.handwriting};
    color: ${({ theme }) => theme.colors.background.surfaceAlt};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ListSub = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
`;

const CreateChatCta = styled.button`
    margin-top: ${({ theme }) => theme.spacing.xxs};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 600;
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
    background-color: ${({ theme }) => theme.colors.accent.gold};
    border: none;
    border-radius: ${({ theme }) => theme.radii.sm};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    cursor: pointer;
`;

const RetryLink = styled.button`
    margin-top: 2px;
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    color: ${({ theme }) => theme.colors.readout.text};
    background: none;
    border: none;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
`;

const Sidebar = ({
    chats,
    chatsLoading,
    chatsError,
    onRetryChats,
    selectedChatId,
    onOpenChat,
    onCreateChat,
    newChatIds,
}) => {
  const { user, profile } = useAuth();
  const [view, setView] = useState('list');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [respondingId, setRespondingId] = useState(null);
  const [pickerFriends, setPickerFriends] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState('');
  const [swapping, runSwap] = useEjectTransition(SWAP_EJECT_MS);
  const latestRequestsId = useRef(0);

  // Counter, not a closure flag — an overlapping call shouldn't clobber a newer result.
  const loadRequests = useCallback(() => {
    if (!user) return;
    const requestId = ++latestRequestsId.current;
    setRequestsLoading(true);
    setRequestsError('');
    fetchIncomingRequests(user.id).then(({ data, error }) => {
      if (latestRequestsId.current !== requestId) return;
      setRequestsLoading(false);
      if (error) {
        setRequestsError('Could not load requests — try again.');
        return;
      }
      setRequests(data);
    });
  }, [user]);

  // Fetches on mount so the header can show an unread-request badge
  // without requiring a visit to the requests view first.
  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Revalidates on open too — no realtime subscription for requests yet.
  useEffect(() => {
    if (view !== 'requests') return;
    loadRequests();
  }, [view, loadRequests]);

  // Same fetch-on-open pattern as Requests above — the friend list is
  // only ever needed here, to pick who to start a chat with.
  useEffect(() => {
    if (view !== 'createChat' || !user) return;
    let active = true;
    setPickerLoading(true);
    setPickerError('');
    fetchFriends(user.id).then(({ data, error }) => {
      if (!active) return;
      setPickerLoading(false);
      if (error) {
        setPickerError('Could not load your friends — try again.');
        return;
      }
      setPickerFriends(data);
    });
    return () => {
      active = false;
    };
  }, [view, user]);

  const swapTo = (nextView) => {
    if (nextView === view || swapping) return;
    runSwap(() => setView(nextView));
  };

  const handleAccept = async (request) => {
    setRespondingId(request.otherId);
    const { error } = await respondToRequest(request.uidA, request.uidB, 'accepted');
    setRespondingId(null);
    if (error) {
      setRequestsError('Could not accept that request — try again.');
      return;
    }
    setRequests((prev) => prev.filter((r) => r.otherId !== request.otherId));
  };

  const handleDecline = async (request) => {
    setRespondingId(request.otherId);
    const { error } = await respondToRequest(request.uidA, request.uidB, 'declined');
    setRespondingId(null);
    if (error) {
      setRequestsError('Could not decline that request — try again.');
      return;
    }
    setRequests((prev) => prev.filter((r) => r.otherId !== request.otherId));
  };

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
                <IconButtonSlot>
                  <IconButton
                    type="button"
                    aria-label={requests.length > 0 ? `Friend requests, ${requests.length} pending` : 'Friend requests'}
                    onClick={() => swapTo('requests')}
                  >
                    <RequestsIcon />
                  </IconButton>
                  {requests.length > 0 && (
                    <RequestBadge aria-hidden="true">{requests.length > 9 ? '9+' : requests.length}</RequestBadge>
                  )}
                </IconButtonSlot>
              </SidebarActions>
            </SidebarHeader>
            <SidebarSearch>
              <SearchField />
            </SidebarSearch>
            {chatsLoading && (
              <ChatList>
                <ChatListSkeleton />
              </ChatList>
            )}
            {!chatsLoading && chatsError && (
              <ListMessage>
                <FieldError>⏸ couldn't load your chats</FieldError>
                <ListSub>something went wrong reaching the server</ListSub>
                <RetryLink type="button" onClick={onRetryChats}>try again</RetryLink>
              </ListMessage>
            )}
            {!chatsLoading && !chatsError && chats.length === 0 && (
              <ListMessage>
                <ListHeadline>no chats yet</ListHeadline>
                <ListSub>start one with a friend</ListSub>
                <CreateChatCta type="button" onClick={() => swapTo('createChat')}>＋ Create chat</CreateChatCta>
              </ListMessage>
            )}
            {!chatsLoading && !chatsError && chats.length > 0 && (
              <ChatList>
                {chats.map((chat) => (
                  <ChatListItem
                    key={chat.chatId}
                    name={chat.name}
                    preview={chat.preview ?? 'no messages yet'}
                    previewMuted={!chat.preview}
                    active={chat.chatId === selectedChatId}
                    isNew={newChatIds?.has(chat.chatId)}
                    onClick={() => onOpenChat(chat)}
                  />
                ))}
                <NewChatRow onClick={() => swapTo('createChat')} />
              </ChatList>
            )}
          </>
        )}
        {view === 'addFriend' && <AddFriendPanel onBack={() => swapTo('list')} />}
        {view === 'requests' && (
          <RequestsPanel
            requests={requests}
            loading={requestsLoading}
            error={requestsError}
            respondingId={respondingId}
            onBack={() => swapTo('list')}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        )}
        {view === 'createChat' && (
          <CreateChatPanel
            friends={pickerFriends}
            loading={pickerLoading}
            error={pickerError}
            onBack={() => swapTo('list')}
            onConfirm={(selectedFriends) => {
              swapTo('list');
              onCreateChat(selectedFriends);
            }}
          />
        )}
      </SwapPane>
      <UserRow name={profile?.display_name ?? '…'} />
    </SideBarContainer>
  )
}

export default Sidebar
