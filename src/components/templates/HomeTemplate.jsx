import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Sidebar from '../organisms/Sidebar/Sidebar';
import MessageSection from '../organisms/MessageSection/MessageSection';
import { ToastStack } from '../molecules/Toast/Toast';
import { useAuth } from '../../hooks/useAuth';
import { useMessagesRealtime } from '../../hooks/useMessagesRealtime';
import { useChatParticipantsRealtime } from '../../hooks/useChatParticipantsRealtime';
import { useOnVisible } from '../../hooks/useOnVisible';
import { fetchChats, createChat, renameChat, leaveChat } from '../../lib/chats';

const fadeUp = keyframes`
    0% { opacity: 0; transform: translateY(16px); }
    100% { opacity: 1; transform: translateY(0); }
`;

// Plays once on mount (login/register hand-off, or a direct nav here).
const HomePageContainer = styled.div`
    height: 100%;
    display: flex;
    animation: ${fadeUp} 400ms ease-out;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }

    /* Below this width, show sidebar or message pane, never both. */
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
    const { user } = useAuth();
    const userId = user?.id;
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [chats, setChats] = useState([]);
    const [chatsLoading, setChatsLoading] = useState(false);
    const [chatsError, setChatsError] = useState('');

    // Counter, not a closure flag, so a stale in-flight call can't clobber a newer one.
    const latestRequestId = useRef(0);

    const loadChats = useCallback(() => {
        if (!userId) return;
        const requestId = ++latestRequestId.current;
        setChatsLoading(true);
        setChatsError('');
        fetchChats(userId).then(({ data, error }) => {
            if (latestRequestId.current !== requestId) return;
            setChatsLoading(false);
            if (error) {
                setChatsError('Could not load your chats — try again.');
                return;
            }
            setChats(data);
        });
    }, [userId]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    // Refetch on refocus — a dropped connection doesn't replay what it missed.
    useOnVisible(loadChats);

    // One realtime subscription covers every chat: feeds the open
    // conversation and every sidebar preview from the same event.
    const chatIds = useMemo(() => chats.map((chat) => chat.chatId), [chats]);
    const [incomingMessage, setIncomingMessage] = useState(null);

    const handleIncomingMessage = useCallback((row) => {
        setChats((prev) => {
            const i = prev.findIndex((chat) => chat.chatId === row.chat_id);
            // Chat not in the list yet (likely a pending refetch) — nothing to bump.
            if (i === -1) return prev;
            const next = [...prev];
            next[i] = { ...next[i], preview: row.content, lastMessageAt: row.sent_at };
            next.sort((a, b) => new Date(b.lastMessageAt ?? b.createdAt) - new Date(a.lastMessageAt ?? a.createdAt));
            return next;
        });
        setIncomingMessage(row);
    }, []);

    useMessagesRealtime(chatIds, handleIncomingMessage);

    // "Added to a chat" moment: gold-pulsing sidebar entry + a toast, both
    // reading off newChatIds.
    const [newChatIds, setNewChatIds] = useState(() => new Set());
    const [toasts, setToasts] = useState([]);
    const toastedIdsRef = useRef(new Set());

    const handleParticipantAdded = useCallback((row) => {
        setNewChatIds((prev) => new Set(prev).add(row.chat_id));
        loadChats();
    }, [loadChats]);

    useChatParticipantsRealtime(userId, handleParticipantAdded);

    // Fires the toast once the chat's name is available in `chats`.
    // toastedIdsRef just tracks which ids already fired.
    useEffect(() => {
        newChatIds.forEach((chatId) => {
            if (toastedIdsRef.current.has(chatId)) return;
            const chat = chats.find((c) => c.chatId === chatId);
            if (!chat) return;
            toastedIdsRef.current.add(chatId);
            const toastId = chatId;
            setToasts((prev) => [...prev, {
                id: toastId,
                title: `Added to ${chat.name}`,
                sub: chat.participants.map((p) => p.name).join(', ') || undefined,
                actionLabel: 'View',
                // Routes through handleOpenChat so it clears the glow too.
                onAction: () => handleOpenChat(chat),
            }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toastId));
            }, 6000);
        });
    }, [chats, newChatIds]);

    // Client-side fast path: reuse an untitled chat with the same
    // participants instead of creating a new one. create_chat's own
    // server-side check is the real authority.
    const handleCreateChat = async (selectedFriends) => {
        const targetIds = new Set([userId, ...selectedFriends.map((f) => f.uid)]);
        const sameParticipants = (ids) => {
            const s = new Set([userId, ...ids]);
            return s.size === targetIds.size && [...s].every((id) => targetIds.has(id));
        };
        const existing = chats.find((chat) => chat.title === null && sameParticipants(chat.participantIds ?? []));
        if (existing) {
            setSelectedChatId(existing.chatId);
            return;
        }

        // Optimistic entry immediately, reconciled with a real refetch after.
        const { data: chatId, error } = await createChat(selectedFriends.map((f) => f.uid));
        if (error) {
            setChatsError('Could not start that chat — try again.');
            return;
        }
        setChats((prev) => [
            {
                chatId,
                title: null,
                name: selectedFriends.map((f) => f.name).join(', '),
                participantIds: selectedFriends.map((f) => f.uid),
                participants: selectedFriends.map((f) => ({ uid: f.uid, name: f.name })),
                preview: null,
                lastMessageAt: null,
                createdAt: new Date().toISOString(),
            },
            ...prev,
        ]);
        setSelectedChatId(chatId);
        loadChats();
    };

    // Non-blank: patch the title in place. Blank clears back to the
    // joined-names display, which needs a real refetch to compute.
    const handleRenameChat = async (chatId, title) => {
        const { error } = await renameChat(chatId, title);
        if (error) return { error };
        if (title) {
            setChats((prev) => prev.map((c) => (c.chatId === chatId ? { ...c, title, name: title } : c)));
        } else {
            loadChats();
        }
        return { error: null };
    };

    // Deselect, then refetch so the chat drops out of this user's list.
    const handleLeaveChat = async (chatId) => {
        const { error } = await leaveChat(chatId);
        if (error) return { error };
        setSelectedChatId((prev) => (prev === chatId ? null : prev));
        loadChats();
        return { error: null };
    };

    const handleOpenChat = (chat) => {
        setSelectedChatId(chat.chatId);
        // Opening it clears the "new" glow.
        setNewChatIds((prev) => {
            if (!prev.has(chat.chatId)) return prev;
            const next = new Set(prev);
            next.delete(chat.chatId);
            return next;
        });
    };

    const selectedChat = chats.find((chat) => chat.chatId === selectedChatId) ?? null;

    return (
        <HomePageContainer $hasSelection={Boolean(selectedChatId)}>
            <Sidebar
                chats={chats}
                chatsLoading={chatsLoading}
                chatsError={chatsError}
                onRetryChats={loadChats}
                selectedChatId={selectedChatId}
                onOpenChat={handleOpenChat}
                onCreateChat={handleCreateChat}
                newChatIds={newChatIds}
            />
            <ToastStack toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
            <MessageSection
                chatId={selectedChat?.chatId ?? null}
                chatName={selectedChat?.name ?? null}
                participants={selectedChat?.participants ?? []}
                userId={userId}
                incomingMessage={incomingMessage}
                onBack={() => setSelectedChatId(null)}
                onRename={(title) => handleRenameChat(selectedChat?.chatId, title)}
                onLeave={() => handleLeaveChat(selectedChat?.chatId)}
                onChatsChanged={loadChats}
            />
        </HomePageContainer>
    );
};

export default HomeTemplate;
