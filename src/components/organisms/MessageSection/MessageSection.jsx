import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { v7 as uuidv7 } from 'uuid';
import { Avatar } from '../../molecules/Avatar/Avatar';
import { Readout } from '../../atoms/Readout/Readout';
import { RecDot } from '../../atoms/RecDot/RecDot';
import { Message } from '../../molecules/Message/Message';
import { MessageForm } from '../../molecules/MessageForm/MessageForm';
import { TapeLabel } from '../../atoms/TapeLabel/TapeLabel';
import { ButtonDark } from '../../atoms/ButtonDark/ButtonDark';
import { FieldError } from '../../atoms/FieldError/FieldError';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { ChatInfoPanel } from '../../molecules/ChatInfoPanel/ChatInfoPanel';
import { CreateChatPanel } from '../../molecules/CreateChatPanel/CreateChatPanel';
import { ConfirmDialog } from '../../molecules/ConfirmDialog/ConfirmDialog';
import { useOnVisible } from '../../../hooks/useOnVisible';
import { fetchMessages, sendMessage } from '../../../lib/messages';
import { fetchFriends } from '../../../lib/friends';
import { addChatParticipant } from '../../../lib/chats';

const Section = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    background-color: ${({ theme }) => theme.colors.background.page};
`;

const ConversationHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutralDark[400]};
`;

const ConversationWho = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

// Name (or its input) plus the pencil beside it.
const NameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const ConversationName = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.displayBold};
    color: ${({ theme }) => theme.colors.text.onDark};
    font-size: 17px;
`;

// Small and quiet — sits beside the name, not a full-size IconButton.
const RenameButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: none;
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    font-size: 12px;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.radii.sm};
    transition: background-color ${({ theme }) => theme.transitions.fast} ease-in-out,
        color ${({ theme }) => theme.transitions.fast} ease-in-out;

    &:hover,
    &:focus-visible {
        color: ${({ theme }) => theme.colors.text.onDark};
        background-color: ${({ theme }) => theme.colors.neutralDark[400]};
    }
`;

// Inline rename input — body/Inter, not displayBold, since vhs-bold has no
// real lowercase (unreadable while typing).
const ConversationNameInput = styled.input`
    height: 32px;
    box-sizing: border-box;
    min-width: 160px;
    background-color: ${({ theme }) => theme.colors.background.surfaceAlt};
    border: none;
    outline: none;
    border-radius: ${({ theme }) => theme.radii.sm};
    padding: 0 ${({ theme }) => theme.spacing.xs};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-weight: 600;
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    color: ${({ theme }) => theme.colors.text.onSurfaceAlt};
    transition: all ${({ theme }) => theme.transitions.base} ease-in-out;

    &:hover {
        background-color: ${({ theme }) => theme.colors.accent.beigeShadow};
    }
    &:focus {
        border-left: 4px solid ${({ theme }) => theme.colors.accent.gold};
        padding-left: calc(${({ theme }) => theme.spacing.xs} - 4px);
    }
`;

const ConversationStatus = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
    color: ${({ theme }) => theme.colors.readout.text};
`;

// REC dot + readout, then the settings icon past a wider gap.
const ConversationRec = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const RecReadout = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const MessageList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.accent.beige} ${({ theme }) => theme.colors.background.page};
`;

// Hidden on desktop — nothing to go back to there.
const BackButton = styled(ButtonDark)`
    display: none;
    width: 32px;
    height: 32px;
    padding: 0;
    margin: 0;
    border-width: 3px;
    border-radius: ${({ theme }) => theme.radii.sm};
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        display: inline-flex;
    }
`;

const EmptyState = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyTapeLabel = styled(TapeLabel)`
    font-size: 20px;
`;

const EmptyStateSub = styled.span`
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
`;

const ListMessage = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const ListSub = styled.span`
    color: ${({ theme }) => theme.colors.neutralDark.highlight};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.caption};
`;

const RetryLink = styled.button`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    font-size: ${({ theme }) => theme.typography.fontSize.body};
    color: ${({ theme }) => theme.colors.readout.text};
    background: none;
    border: none;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
`;

const SendError = styled(FieldError)`
    padding: 0 ${({ theme }) => theme.spacing.md};
`;

// ---- Loading: on-screen VCR rewind overlay.
const rewBlink = keyframes`
    50% { opacity: 0.25; }
`;

const staticShift = keyframes`
    to { background-position: 24px 0; }
`;

const RewindScreen = styled.div`
    position: relative;
    width: 160px;
    height: 70px;
    background-color: ${({ theme }) => theme.colors.neutralDark[500]};
    border: 1px solid ${({ theme }) => theme.colors.neutralDark[400]};
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
`;

const RewTopRow = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: baseline;
    gap: 6px;
`;

const RewChevrons = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.readout.text};
    font-size: 20px;
    text-shadow: 0 0 5px ${({ theme }) => theme.colors.readout.text};
    animation: ${rewBlink} 0.9s steps(1) infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const RewWord = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.readout.text};
    font-size: 17px;
    letter-spacing: 0.05em;
`;

const RewCounter = styled.div`
    position: relative;
    z-index: 1;
    align-self: flex-end;
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.readout.text};
    font-size: 17px;
    text-shadow: 0 0 5px ${({ theme }) => theme.colors.readout.text};
`;

const RewNoise = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: ${({ $top }) => ($top !== undefined ? `${$top}px` : 'auto')};
    bottom: ${({ $bottom }) => ($bottom !== undefined ? `${$bottom}px` : 'auto')};
    height: 7px;
    background-image: repeating-linear-gradient(
        90deg,
        ${({ theme }) => theme.colors.neutralDark.highlight} 0 2px,
        transparent 2px 6px
    );
    opacity: 0.45;
    animation: ${staticShift} 0.2s steps(3) infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

// ---- Loaded, but empty: same VCR overlay family as the rewind screen.
const PlayScreen = styled.div`
    width: 160px;
    height: 70px;
    background-color: ${({ theme }) => theme.colors.neutralDark[500]};
    border: 1px solid ${({ theme }) => theme.colors.neutralDark[400]};
    border-radius: 6px;
    display: flex;
    align-items: flex-start;
    padding: ${({ theme }) => theme.spacing.sm};
`;

const PlayLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const PlayWord = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
    color: ${({ theme }) => theme.colors.readout.text};
    font-size: 18px;
    letter-spacing: 0.05em;
    text-shadow: 0 0 5px ${({ theme }) => theme.colors.readout.text};
`;

const PlayTri = styled.span`
    color: ${({ theme }) => theme.colors.readout.text};
    font-size: 15px;
    text-shadow: 0 0 5px ${({ theme }) => theme.colors.readout.text};
`;

const CONTACT_STATUS = 'online';

const formatElapsed = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
};

const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

// Idempotent upsert by message_id — used for both our own insert response
// and a realtime echo of it.
const upsertRow = (rows, row) => {
    const i = rows.findIndex((m) => m.message_id === row.message_id);
    if (i === -1) {
        return [...rows, row].sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
    }
    const next = [...rows];
    next[i] = { ...next[i], ...row, pending: false };
    return next;
};

const MessageSection = ({
    chatId,
    chatName,
    participants,
    userId,
    incomingMessage,
    onBack,
    onRename,
    onLeave,
    onChatsChanged,
}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sendError, setSendError] = useState('');
    const latestRequestId = useRef(0);

    // 'conversation' | 'info' (ChatInfoPanel) | 'addPeople' (CreateChatPanel,
    // add mode). Resets on chat switch.
    const [paneView, setPaneView] = useState('conversation');
    useEffect(() => {
        setPaneView('conversation');
    }, [chatId]);

    // nameSeedRef guards the no-op case: blurring without changes shouldn't fire a rename call.
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [renameError, setRenameError] = useState('');
    const nameSeedRef = useRef('');

    useEffect(() => {
        setEditingName(false);
        setRenameError('');
    }, [chatId]);

    const startEditingName = () => {
        setNameDraft(chatName ?? '');
        nameSeedRef.current = chatName ?? '';
        setRenameError('');
        setEditingName(true);
    };

    const commitRename = async () => {
        const trimmed = nameDraft.trim();
        setEditingName(false);
        if (trimmed === nameSeedRef.current) return;
        const { error } = await onRename(trimmed);
        if (error) setRenameError('Could not rename — try again.');
    };

    const [addFriends, setAddFriends] = useState([]);
    const [addFriendsLoading, setAddFriendsLoading] = useState(false);
    const [addFriendsError, setAddFriendsError] = useState('');
    const [addBusy, setAddBusy] = useState(false);

    // Fetch-on-open, filtered below to friends not already in this chat.
    useEffect(() => {
        if (paneView !== 'addPeople' || !userId) return;
        let active = true;
        setAddFriendsLoading(true);
        setAddFriendsError('');
        fetchFriends(userId).then(({ data, error }) => {
            if (!active) return;
            setAddFriendsLoading(false);
            if (error) {
                setAddFriendsError('Could not load your friends — try again.');
                return;
            }
            setAddFriends(data);
        });
        return () => {
            active = false;
        };
    }, [paneView, userId]);

    const participantIds = new Set((participants ?? []).map((p) => p.uid));
    const addableFriends = addFriends.filter((f) => !participantIds.has(f.uid));

    const handleAddPeopleConfirm = async (selectedFriends) => {
        setAddBusy(true);
        const results = await Promise.all(
            selectedFriends.map((f) => addChatParticipant(chatId, f.uid))
        );
        setAddBusy(false);
        const firstError = results.find((r) => r.error)?.error;
        if (firstError) {
            setAddFriendsError('Could not add everyone — try again.');
            return;
        }
        onChatsChanged?.();
        setPaneView('info');
    };

    const [confirmingLeave, setConfirmingLeave] = useState(false);
    const [leaveBusy, setLeaveBusy] = useState(false);
    const [leaveError, setLeaveError] = useState('');

    const handleConfirmLeave = async () => {
        setLeaveBusy(true);
        const { error } = await onLeave();
        setLeaveBusy(false);
        if (error) {
            setLeaveError('Could not leave — try again.');
            return;
        }
        setConfirmingLeave(false);
    };

    // Header readout — a plain ticking clock, not a per-conversation counter.
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(id);
    }, []);

    // Drives the rewind screen's counter — a real elapsed timer.
    const [elapsedMs, setElapsedMs] = useState(0);
    useEffect(() => {
        if (!loading) return;
        setElapsedMs(0);
        const start = Date.now();
        const id = setInterval(() => setElapsedMs(Date.now() - start), 250);
        return () => clearInterval(id);
    }, [loading]);

    const loadMessages = useCallback(() => {
        if (!chatId) return;
        const requestId = ++latestRequestId.current;
        setLoading(true);
        setError('');
        fetchMessages(chatId).then(({ data, error }) => {
            if (latestRequestId.current !== requestId) return;
            setLoading(false);
            if (error) {
                setError('Could not load messages — try again.');
                return;
            }
            // Union, not replace — keeps any message a realtime event or
            // in-flight send added while this fetch was out.
            setMessages((prev) => {
                const notYetInFetch = prev.filter((m) => !data.some((row) => row.message_id === m.message_id));
                return [...data, ...notYetInFetch].sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
            });
        });
    }, [chatId]);

    useEffect(() => {
        setMessages([]);
        setSendError('');
        loadMessages();
    }, [loadMessages]);

    // Refetch on refocus, in case a realtime event was missed.
    useOnVisible(loadMessages);

    // Only react to incoming messages for the chat that's actually open.
    useEffect(() => {
        if (!incomingMessage || incomingMessage.chat_id !== chatId) return;
        setMessages((prev) => upsertRow(prev, incomingMessage));
    }, [incomingMessage, chatId]);

    const handleSend = async (text) => {
        const id = uuidv7();
        const optimistic = {
            message_id: id,
            chat_id: chatId,
            sender_id: userId,
            content: text,
            sent_at: new Date().toISOString(),
            pending: true,
        };
        setSendError('');
        setMessages((prev) => [...prev, optimistic]);

        const { data, error } = await sendMessage(chatId, userId, text, id);
        if (error) {
            setMessages((prev) => prev.filter((m) => m.message_id !== id));
            setSendError('Could not send that — try again.');
            return;
        }
        setMessages((prev) => upsertRow(prev, data));
    };

    if (!chatId) {
        return (
            <Section>
                <EmptyState>
                    <EmptyTapeLabel>▶ select a conversation to start playing</EmptyTapeLabel>
                    <EmptyStateSub>or press ＋ to add a friend</EmptyStateSub>
                </EmptyState>
            </Section>
        );
    }

    if (paneView === 'info') {
        return (
            <Section>
                <ChatInfoPanel
                    participants={participants ?? []}
                    onBack={() => setPaneView('conversation')}
                    onOpenAddPeople={() => setPaneView('addPeople')}
                    onRequestLeave={() => {
                        setLeaveError('');
                        setConfirmingLeave(true);
                    }}
                />
                <ConfirmDialog
                    open={confirmingLeave}
                    title={`Leave "${chatName}"?`}
                    body="You won't see new messages here, and you'll need someone already in the chat to add you back."
                    error={leaveError}
                    confirmLabel="Leave"
                    destructive
                    busy={leaveBusy}
                    onConfirm={handleConfirmLeave}
                    onCancel={() => setConfirmingLeave(false)}
                />
            </Section>
        );
    }

    if (paneView === 'addPeople') {
        return (
            <Section>
                <CreateChatPanel
                    friends={addableFriends}
                    loading={addFriendsLoading || addBusy}
                    error={addFriendsError}
                    onBack={() => setPaneView('info')}
                    onConfirm={handleAddPeopleConfirm}
                    heading="Add people"
                    backLabel="Back to chat info"
                    emptyHint="▶ everyone you know is already here"
                    getConfirmLabel={(selected) => {
                        if (selected.length === 0) return 'Select people to add';
                        if (selected.length === 1) return `Add ${selected[0].name}`;
                        return `Add ${selected.length} people`;
                    }}
                />
            </Section>
        );
    }

    return (
        <Section>
            <ConversationHeader>
                <ConversationWho>
                    <BackButton type="button" aria-label="Back to chat list" onClick={onBack}>
                        ←
                    </BackButton>
                    <Avatar name={chatName} />
                    <div>
                        {editingName ? (
                            <ConversationNameInput
                                autoFocus
                                value={nameDraft}
                                onChange={(e) => setNameDraft(e.target.value)}
                                onBlur={commitRename}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') e.currentTarget.blur();
                                    if (e.key === 'Escape') setEditingName(false);
                                }}
                            />
                        ) : (
                            <NameRow>
                                <ConversationName>{chatName}</ConversationName>
                                <RenameButton type="button" aria-label="Rename chat" onClick={startEditingName}>✎</RenameButton>
                            </NameRow>
                        )}
                        <ConversationStatus>{CONTACT_STATUS}</ConversationStatus>
                        {renameError && <FieldError>{renameError}</FieldError>}
                    </div>
                </ConversationWho>
                <ConversationRec>
                    <RecReadout>
                        <RecDot />
                        <Readout>{formatTime(now.toISOString())}</Readout>
                    </RecReadout>
                    <IconButton type="button" aria-label="Chat info" onClick={() => setPaneView('info')}>⚙</IconButton>
                </ConversationRec>
            </ConversationHeader>
            {loading && (
                <ListMessage>
                    <RewindScreen>
                        <RewNoise $top={22} />
                        <RewTopRow>
                            <RewChevrons>◀◀</RewChevrons>
                            <RewWord>REW</RewWord>
                        </RewTopRow>
                        <RewNoise $bottom={20} />
                        <RewCounter>{formatElapsed(elapsedMs)}</RewCounter>
                    </RewindScreen>
                    <ListSub>▶ rewinding to the start…</ListSub>
                </ListMessage>
            )}
            {!loading && error && (
                <ListMessage>
                    <FieldError>⏸ couldn't load messages</FieldError>
                    <ListSub>something went wrong reaching the server</ListSub>
                    <RetryLink type="button" onClick={loadMessages}>try again</RetryLink>
                </ListMessage>
            )}
            {!loading && !error && messages.length === 0 && (
                <ListMessage>
                    <PlayScreen>
                        <PlayLabel>
                            <PlayWord>PLAY</PlayWord>
                            <PlayTri>▶</PlayTri>
                        </PlayLabel>
                    </PlayScreen>
                    <ListSub>nothing recorded yet. say hi?</ListSub>
                </ListMessage>
            )}
            {!loading && !error && messages.length > 0 && (
                <MessageList>
                    {messages.map((message) => (
                        <Message
                            key={message.message_id}
                            name={chatName}
                            text={message.content}
                            time={formatTime(message.sent_at)}
                            own={message.sender_id === userId}
                            pending={message.pending}
                        />
                    ))}
                </MessageList>
            )}
            {sendError && <SendError>{sendError}</SendError>}
            <MessageForm onSend={handleSend} />
        </Section>
    );
};

export default MessageSection;
