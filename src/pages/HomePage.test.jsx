import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen, waitFor, act } from '../test-utils';
import HomePage from './HomePage';

// Base fixtures: two chats (Big Beeg, Mom) plus a friend, Jules, with no
// chat yet. Each query chain gets its own exported vi.fn() handle.
vi.mock('../lib/supabaseClient', () => {
    const profileSingle = vi.fn().mockResolvedValue({
        data: { uid: 'me', display_name: 'Test User', onboarding_completed: true },
        error: null,
    });
    const findProfileByName = vi.fn().mockResolvedValue({ data: null, error: null });
    const incomingRequests = vi.fn().mockResolvedValue({ data: [], error: null });
    const insertFriendship = vi.fn().mockResolvedValue({ data: {}, error: null });
    const updateFriendship = vi.fn().mockResolvedValue({ data: {}, error: null });
    const acceptedFriendships = vi.fn().mockResolvedValue({
        data: [{ uida: 'jules-id', uidb: 'me' }],
        error: null,
    });
    const createChatRpc = vi.fn().mockResolvedValue({ data: 'new-chat-id', error: null });
    // rename/add/leave all resolve to a bare { error: null } shape by default.
    const renameChatRpc = vi.fn().mockResolvedValue({ data: null, error: null });
    const addParticipantRpc = vi.fn().mockResolvedValue({ data: null, error: null });
    const leaveChatRpc = vi.fn().mockResolvedValue({ data: null, error: null });
    // Conversations start empty unless a test queues a history.
    // insertMessage echoes the row back plus a server sent_at.
    const messagesByChat = vi.fn().mockResolvedValue({ data: [], error: null });
    // Channels keyed by name (HomeTemplate opens messages:mine and
    // chat_participants:mine) so tests can target either one. .on()
    // captures the callback for firing synthetic events; .subscribe()
    // marks the channel joined; a test can also flip .state directly.
    const channelsByName = new Map();
    const channelFn = vi.fn((name) => {
        const chan = {
            on: vi.fn((_event, _config, callback) => {
                chan._callback = callback;
                return chan;
            }),
            subscribe: vi.fn(() => {
                chan.state = 'joined';
                return chan;
            }),
        };
        channelsByName.set(name, chan);
        return chan;
    });
    const removeChannelFn = vi.fn();
    const setAuthFn = vi.fn();
    const insertMessage = vi.fn((row) =>
        Promise.resolve({ data: { ...row, sent_at: '2026-01-04T00:00:00Z' }, error: null })
    );

    const myParticipation = vi.fn().mockResolvedValue({
        data: [{ chat_id: 'chat-big-beeg' }, { chat_id: 'chat-mom' }],
        error: null,
    });
    const chatsById = vi.fn().mockResolvedValue({
        data: [
            {
                chat_id: 'chat-big-beeg',
                title: null,
                last_message_preview: 'rewind that last part lol',
                last_message_at: '2026-01-02T00:00:00Z',
                created_at: '2026-01-02T00:00:00Z',
            },
            {
                chat_id: 'chat-mom',
                title: null,
                last_message_preview: 'call me when you land',
                last_message_at: '2026-01-01T00:00:00Z',
                created_at: '2026-01-01T00:00:00Z',
            },
        ],
        error: null,
    });
    const allParticipants = vi.fn().mockResolvedValue({
        data: [
            { chat_id: 'chat-big-beeg', uid: 'me' },
            { chat_id: 'chat-big-beeg', uid: 'big-beeg-id' },
            { chat_id: 'chat-mom', uid: 'me' },
            { chat_id: 'chat-mom', uid: 'mom-id' },
        ],
        error: null,
    });
    // Shared by fetchChats/fetchFriends/fetchIncomingRequests's identical
    // profiles.select(...).in(...) — call order per test matters.
    const profilesByIds = vi.fn().mockResolvedValue({
        data: [
            { uid: 'big-beeg-id', display_name: 'Big Beeg' },
            { uid: 'mom-id', display_name: 'Mom' },
        ],
        error: null,
    });

    return {
        supabase: {
            auth: {
                getSession: vi.fn().mockResolvedValue({
                    data: { session: { user: { id: 'me' }, access_token: 'test-token' } },
                    error: null,
                }),
                onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
                signUp: vi.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
                signInWithPassword: vi.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
                signOut: vi.fn().mockResolvedValue({ error: null }),
            },
            realtime: { setAuth: setAuthFn },
            channel: channelFn,
            removeChannel: removeChannelFn,
            rpc: vi.fn((fn, args) => {
                if (fn === 'create_chat') return createChatRpc(args);
                if (fn === 'rename_chat') return renameChatRpc(args);
                if (fn === 'add_chat_participant') return addParticipantRpc(args);
                if (fn === 'leave_chat') return leaveChatRpc(args);
                return Promise.resolve({ data: null, error: null });
            }),
            from: vi.fn((table) => {
                if (table === 'profiles') {
                    return {
                        select: vi.fn((cols) => {
                            if (cols === '*') {
                                return { eq: vi.fn(() => ({ single: profileSingle })) };
                            }
                            return {
                                eq: vi.fn(() => ({ maybeSingle: findProfileByName })),
                                in: vi.fn(() => profilesByIds()),
                            };
                        }),
                        update: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn(() => ({ single: profileSingle })) })) })),
                    };
                }
                if (table === 'friendships') {
                    return {
                        select: vi.fn(() => ({
                            eq: vi.fn(() => ({
                                or: vi.fn(() => acceptedFriendships()),
                                neq: vi.fn(() => ({ or: vi.fn(() => incomingRequests()) })),
                            })),
                        })),
                        insert: vi.fn(() => ({ select: vi.fn(() => ({ single: insertFriendship })) })),
                        update: vi.fn(() => ({
                            eq: vi.fn(() => ({
                                eq: vi.fn(() => ({ select: vi.fn(() => ({ single: updateFriendship })) })),
                            })),
                        })),
                    };
                }
                if (table === 'chat_participants') {
                    return {
                        select: vi.fn(() => ({
                            eq: vi.fn(() => myParticipation()),
                            in: vi.fn(() => allParticipants()),
                        })),
                    };
                }
                if (table === 'chats') {
                    return { select: vi.fn(() => ({ in: vi.fn(() => chatsById()) })) };
                }
                if (table === 'messages') {
                    return {
                        select: vi.fn(() => ({
                            eq: vi.fn(() => ({ order: vi.fn(() => messagesByChat()) })),
                        })),
                        insert: vi.fn((row) => ({
                            select: vi.fn(() => ({ single: vi.fn(() => insertMessage(row)) })),
                        })),
                    };
                }
                return {};
            }),
        },
        mockProfileSingle: profileSingle,
        mockFindProfileByName: findProfileByName,
        mockIncomingRequests: incomingRequests,
        mockInsertFriendship: insertFriendship,
        mockAcceptedFriendships: acceptedFriendships,
        mockProfilesByIds: profilesByIds,
        mockCreateChatRpc: createChatRpc,
        mockRenameChatRpc: renameChatRpc,
        mockAddParticipantRpc: addParticipantRpc,
        mockLeaveChatRpc: leaveChatRpc,
        mockMyParticipation: myParticipation,
        mockChatsById: chatsById,
        mockAllParticipants: allParticipants,
        mockMessagesByChat: messagesByChat,
        mockInsertMessage: insertMessage,
        // Fires the messages:mine channel's registered callback with a
        // synthetic inserted row.
        triggerRealtimeMessage: (row) => channelsByName.get('messages:mine')?._callback?.({ new: row }),
        // Same for chat_participants:mine, with a synthetic added row.
        triggerChatParticipantAdded: (row = { chat_id: 'new-chat-id', uid: 'me' }) =>
            channelsByName.get('chat_participants:mine')?._callback?.({ new: row }),
        mockChannel: channelFn,
        mockRemoveChannel: removeChannelFn,
        mockSetAuth: setAuthFn,
        setLatestChannelState: (state) => {
            const chan = channelsByName.get('messages:mine');
            if (chan) chan.state = state;
        },
    };
});
import {
    mockFindProfileByName,
    mockIncomingRequests,
    mockInsertFriendship,
    mockAcceptedFriendships,
    mockProfilesByIds,
    mockCreateChatRpc,
    mockRenameChatRpc,
    mockAddParticipantRpc,
    mockLeaveChatRpc,
    mockMyParticipation,
    mockChatsById,
    mockAllParticipants,
    mockMessagesByChat,
    mockInsertMessage,
    triggerRealtimeMessage,
    triggerChatParticipantAdded,
    mockChannel,
    mockRemoveChannel,
    mockSetAuth,
    setLatestChannelState,
} from '../lib/supabaseClient';

describe('HomePage', () => {
    it('renders the sidebar with existing chats by default', async () => {
        renderWithProviders(<HomePage />);
        expect(screen.getByText('Waffler')).toBeInTheDocument();
        expect(await screen.findByText('Big Beeg')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        expect(screen.getByText(/select a conversation/i)).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Message')).not.toBeInTheDocument();
    });

    it('opens a conversation when an existing chat is selected', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);

        await user.click(await screen.findByText('Big Beeg'));

        expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
        expect(screen.getByText('online')).toBeInTheDocument();
        expect(screen.queryByText(/select a conversation/i)).not.toBeInTheDocument();
        await waitFor(() => expect(mockMessagesByChat).toHaveBeenCalled());
        // Empty messages (the shared default) should show the PLAY screen.
        expect(await screen.findByText('PLAY')).toBeInTheDocument();
    });

    it('sends a message and appends it to that conversation only', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);

        await user.click(await screen.findByText('Big Beeg'));
        const input = screen.getByPlaceholderText('Message');
        await user.type(input, 'testing the compose bar');
        await user.click(screen.getByRole('button', { name: /send/i }));

        // Optimistic append, before the insert promise resolves.
        expect(screen.getByText('testing the compose bar')).toBeInTheDocument();
        expect(input).toHaveValue('');

        await waitFor(() => expect(mockInsertMessage).toHaveBeenCalledTimes(1));
        const [sentRow] = mockInsertMessage.mock.calls[0];
        expect(sentRow).toMatchObject({ chat_id: 'chat-big-beeg', sender_id: 'me', content: 'testing the compose bar' });

        await user.click(screen.getByText('Mom'));

        expect(screen.queryByText('testing the compose bar')).not.toBeInTheDocument();
    });

    it('sends a friend request and shows a local confirmation', async () => {
        mockFindProfileByName.mockResolvedValueOnce({
            data: { uid: 'zephyr-id', display_name: 'zephyr' },
            error: null,
        });
        mockInsertFriendship.mockResolvedValueOnce({ data: {}, error: null });

        const user = userEvent.setup();
        renderWithProviders(<HomePage />);

        await user.click(screen.getByRole('button', { name: 'Add friend' }));
        const input = await screen.findByPlaceholderText('Enter a display name');

        await user.click(screen.getByRole('button', { name: /send request/i }));
        expect(await screen.findByText(/enter a display name first/i)).toBeInTheDocument();

        await user.type(input, 'zephyr');
        await user.click(screen.getByRole('button', { name: /send request/i }));
        expect(await screen.findByText('Request sent to zephyr.')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /back to chats/i }));
        expect(await screen.findByText('Waffler')).toBeInTheDocument();
    });

    it('accepts and declines friend requests', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);
        await screen.findByText('Big Beeg'); // wait for the initial chat list load

        // Queued after the initial load so it isn't consumed by mount's own fetchChats.
        mockIncomingRequests.mockResolvedValueOnce({
            data: [
                { uida: 'me', uidb: 'nadia-id', requested_at: '2026-01-01T00:00:00Z' },
                { uida: 'me', uidb: 'theo-id', requested_at: '2026-01-01T00:00:00Z' },
            ],
            error: null,
        });
        mockProfilesByIds.mockResolvedValueOnce({
            data: [
                { uid: 'nadia-id', display_name: 'Nadia' },
                { uid: 'theo-id', display_name: 'Theo' },
            ],
            error: null,
        });

        await user.click(screen.getByRole('button', { name: /Friend requests/ }));
        expect(await screen.findByText('Requests · 2')).toBeInTheDocument();
        expect(screen.getByText('Nadia')).toBeInTheDocument();
        expect(screen.getByText('Theo')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Accept Nadia' }));
        expect(await screen.findByText('Requests · 1')).toBeInTheDocument();
        expect(screen.queryByText('Nadia')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Decline Theo' }));
        expect(await screen.findByText(/no pending requests/i)).toBeInTheDocument();
    });

    it('shows an unread-request badge without opening the panel', async () => {
        // Queued before render so the mount-time fetch consumes it.
        mockIncomingRequests.mockResolvedValueOnce({
            data: [{ uida: 'me', uidb: 'nadia-id', requested_at: '2026-01-01T00:00:00Z' }],
            error: null,
        });
        mockProfilesByIds.mockResolvedValueOnce({
            data: [{ uid: 'nadia-id', display_name: 'Nadia' }],
            error: null,
        });

        renderWithProviders(<HomePage />);
        await screen.findByText('Big Beeg');

        expect(await screen.findByText('1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Friend requests, 1 pending' })).toBeInTheDocument();
    });

    it('keeps the requests list visible while a reopen revalidates in the background', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);
        await screen.findByText('Big Beeg');

        mockIncomingRequests.mockResolvedValueOnce({
            data: [{ uida: 'me', uidb: 'nadia-id', requested_at: '2026-01-01T00:00:00Z' }],
            error: null,
        });
        mockProfilesByIds.mockResolvedValueOnce({
            data: [{ uid: 'nadia-id', display_name: 'Nadia' }],
            error: null,
        });

        await user.click(screen.getByRole('button', { name: /Friend requests/ }));
        expect(await screen.findByText('Nadia')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Back to chats' }));
        await screen.findByText('Waffler'); // let the swap transition finish before reopening

        // Reopening starts a refetch that hasn't resolved yet — the
        // previous list should stay on screen, not flash to loading.
        let resolveReopen;
        mockIncomingRequests.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveReopen = resolve;
            })
        );
        await user.click(screen.getByRole('button', { name: /Friend requests/ }));
        // findBy to ride out the swap-pane animation.
        expect(await screen.findByText('Nadia')).toBeInTheDocument();
        expect(screen.queryByText(/loading requests/i)).not.toBeInTheDocument();

        resolveReopen({
            data: [{ uida: 'me', uidb: 'nadia-id', requested_at: '2026-01-01T00:00:00Z' }],
            error: null,
        });
        await waitFor(() => expect(screen.getByText('Nadia')).toBeInTheDocument());
    });

    it('starts a chat through the "New chat" picker', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);
        await screen.findByText('Big Beeg');

        // First for the picker's friend list, then for handleCreateChat's
        // own post-create refetch — that mock must already include the
        // new chat, or it'd clobber the optimistic entry with stale data.
        mockProfilesByIds.mockResolvedValueOnce({
            data: [{ uid: 'jules-id', display_name: 'Jules' }],
            error: null,
        });
        mockMyParticipation.mockResolvedValueOnce({
            data: [{ chat_id: 'chat-big-beeg' }, { chat_id: 'chat-mom' }, { chat_id: 'new-chat-id' }],
            error: null,
        });
        mockChatsById.mockResolvedValueOnce({
            data: [
                {
                    chat_id: 'chat-big-beeg',
                    title: null,
                    last_message_preview: 'rewind that last part lol',
                    last_message_at: '2026-01-02T00:00:00Z',
                    created_at: '2026-01-02T00:00:00Z',
                },
                {
                    chat_id: 'chat-mom',
                    title: null,
                    last_message_preview: 'call me when you land',
                    last_message_at: '2026-01-01T00:00:00Z',
                    created_at: '2026-01-01T00:00:00Z',
                },
                {
                    chat_id: 'new-chat-id',
                    title: null,
                    last_message_preview: null,
                    last_message_at: null,
                    created_at: '2026-01-03T00:00:00Z',
                },
            ],
            error: null,
        });
        mockAllParticipants.mockResolvedValueOnce({
            data: [
                { chat_id: 'chat-big-beeg', uid: 'me' },
                { chat_id: 'chat-big-beeg', uid: 'big-beeg-id' },
                { chat_id: 'chat-mom', uid: 'me' },
                { chat_id: 'chat-mom', uid: 'mom-id' },
                { chat_id: 'new-chat-id', uid: 'me' },
                { chat_id: 'new-chat-id', uid: 'jules-id' },
            ],
            error: null,
        });
        mockProfilesByIds.mockResolvedValueOnce({
            data: [
                { uid: 'big-beeg-id', display_name: 'Big Beeg' },
                { uid: 'mom-id', display_name: 'Mom' },
                { uid: 'jules-id', display_name: 'Jules' },
            ],
            error: null,
        });

        await user.click(screen.getByRole('button', { name: 'New chat' }));
        // Disambiguates from the "New chat" row's own text during the swap.
        await screen.findByPlaceholderText('Search friends');

        await user.click(await screen.findByText('Jules'));
        await user.click(screen.getByRole('button', { name: 'Message Jules' }));

        expect(mockCreateChatRpc).toHaveBeenCalledWith({ other_user_ids: ['jules-id'], chat_title: null });
        expect(await screen.findByPlaceholderText('Message')).toBeInTheDocument();
        expect(mockAcceptedFriendships).toHaveBeenCalled();
    });

    it('reuses an existing untitled chat instead of creating a duplicate', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);
        await screen.findByText('Big Beeg');

        // Offers Big Beeg — already chat-big-beeg's other participant.
        mockAcceptedFriendships.mockResolvedValueOnce({
            data: [{ uida: 'big-beeg-id', uidb: 'me' }],
            error: null,
        });
        mockProfilesByIds.mockResolvedValueOnce({
            data: [{ uid: 'big-beeg-id', display_name: 'Big Beeg' }],
            error: null,
        });

        // Call count persists across tests, so check a baseline diff, not "never called".
        const createChatCallsBefore = mockCreateChatRpc.mock.calls.length;

        await user.click(screen.getByRole('button', { name: 'New chat' }));
        await screen.findByPlaceholderText('Search friends');

        await user.click(await screen.findByText('Big Beeg'));
        await user.click(screen.getByRole('button', { name: 'Message Big Beeg' }));

        // Opens the existing chat directly, no RPC round trip.
        expect(await screen.findByPlaceholderText('Message')).toBeInTheDocument();
        expect(screen.getByText('online')).toBeInTheDocument();
        expect(mockCreateChatRpc.mock.calls.length).toBe(createChatCallsBefore);
    });

    describe('chat management', () => {
        it('opens chat info from the header settings icon and shows the participant list', async () => {
            const user = userEvent.setup();
            renderWithProviders(<HomePage />);
            await user.click(await screen.findByText('Big Beeg'));
            await screen.findByPlaceholderText('Message');

            await user.click(screen.getByRole('button', { name: 'Chat info' }));

            expect(await screen.findByText('Chat info')).toBeInTheDocument();
            expect(screen.getByText('Leave chat')).toBeInTheDocument();
            expect(screen.getByText("that's you")).toBeInTheDocument();
            expect(screen.getAllByText('Big Beeg').length).toBeGreaterThan(0);
        });

        it('renames a chat from the header pencil icon', async () => {
            const user = userEvent.setup();
            renderWithProviders(<HomePage />);
            await user.click(await screen.findByText('Big Beeg'));
            await screen.findByPlaceholderText('Message');

            await user.click(screen.getByRole('button', { name: 'Rename chat' }));
            const input = screen.getByDisplayValue('Big Beeg');
            await user.clear(input);
            await user.type(input, 'Trip planning{Enter}');

            await waitFor(() =>
                expect(mockRenameChatRpc).toHaveBeenCalledWith({ p_chat_id: 'chat-big-beeg', p_title: 'Trip planning' })
            );
            // Optimistically patched — shows in header and sidebar, no refetch needed.
            await waitFor(() => expect(screen.getAllByText('Trip planning').length).toBeGreaterThan(0));
        });

        it('adds a participant from the info panel', async () => {
            const user = userEvent.setup();
            renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');

            // Queued for the "add people" picker's own fetchFriends call.
            mockProfilesByIds.mockResolvedValueOnce({
                data: [{ uid: 'jules-id', display_name: 'Jules' }],
                error: null,
            });

            await user.click(screen.getByText('Big Beeg'));
            await screen.findByPlaceholderText('Message');
            await user.click(screen.getByRole('button', { name: 'Chat info' }));
            await user.click(await screen.findByText('＋ Add people'));

            await user.click(await screen.findByText('Jules'));
            await user.click(screen.getByRole('button', { name: 'Add Jules' }));

            await waitFor(() =>
                expect(mockAddParticipantRpc).toHaveBeenCalledWith({ p_chat_id: 'chat-big-beeg', p_uid: 'jules-id' })
            );
            // Back on the info pane, not left on the picker.
            expect(await screen.findByText('Chat info')).toBeInTheDocument();
        });

        it('leaves a chat after confirming, and does nothing on cancel', async () => {
            const user = userEvent.setup();
            renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');
            await user.click(screen.getByText('Big Beeg'));
            await screen.findByPlaceholderText('Message');
            await user.click(screen.getByRole('button', { name: 'Chat info' }));

            const leaveCallsBefore = mockLeaveChatRpc.mock.calls.length;

            await user.click(screen.getByText('Leave chat'));
            expect(await screen.findByText('Leave "Big Beeg"?')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'Cancel' }));
            expect(screen.queryByText('Leave "Big Beeg"?')).not.toBeInTheDocument();
            expect(mockLeaveChatRpc.mock.calls.length).toBe(leaveCallsBefore);

            // Post-leave refetch: only Mom remains.
            mockMyParticipation.mockResolvedValueOnce({ data: [{ chat_id: 'chat-mom' }], error: null });
            mockChatsById.mockResolvedValueOnce({
                data: [{
                    chat_id: 'chat-mom',
                    title: null,
                    last_message_preview: 'call me when you land',
                    last_message_at: '2026-01-01T00:00:00Z',
                    created_at: '2026-01-01T00:00:00Z',
                }],
                error: null,
            });
            mockAllParticipants.mockResolvedValueOnce({
                data: [{ chat_id: 'chat-mom', uid: 'me' }, { chat_id: 'chat-mom', uid: 'mom-id' }],
                error: null,
            });
            mockProfilesByIds.mockResolvedValueOnce({ data: [{ uid: 'mom-id', display_name: 'Mom' }], error: null });

            await user.click(screen.getByText('Leave chat'));
            await user.click(screen.getByRole('button', { name: 'Leave' }));

            await waitFor(() => expect(mockLeaveChatRpc.mock.calls.length).toBe(leaveCallsBefore + 1));
            expect(mockLeaveChatRpc.mock.calls.at(-1)[0]).toEqual({ p_chat_id: 'chat-big-beeg' });
            // Deselected, and gone from the sidebar once the refetch lands.
            expect(await screen.findByText(/select a conversation/i)).toBeInTheDocument();
            await waitFor(() => expect(screen.queryByText('Big Beeg')).not.toBeInTheDocument());
        });

        it('shows a toast and sidebar glow when added to a new chat, both clearing on open', async () => {
            renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');

            mockMyParticipation.mockResolvedValueOnce({
                data: [{ chat_id: 'chat-big-beeg' }, { chat_id: 'chat-mom' }, { chat_id: 'new-chat-id' }],
                error: null,
            });
            mockChatsById.mockResolvedValueOnce({
                data: [
                    {
                        chat_id: 'chat-big-beeg',
                        title: null,
                        last_message_preview: 'rewind that last part lol',
                        last_message_at: '2026-01-02T00:00:00Z',
                        created_at: '2026-01-02T00:00:00Z',
                    },
                    {
                        chat_id: 'chat-mom',
                        title: null,
                        last_message_preview: 'call me when you land',
                        last_message_at: '2026-01-01T00:00:00Z',
                        created_at: '2026-01-01T00:00:00Z',
                    },
                    {
                        chat_id: 'new-chat-id',
                        title: null,
                        last_message_preview: null,
                        last_message_at: null,
                        created_at: '2026-01-03T00:00:00Z',
                    },
                ],
                error: null,
            });
            mockAllParticipants.mockResolvedValueOnce({
                data: [
                    { chat_id: 'chat-big-beeg', uid: 'me' },
                    { chat_id: 'chat-big-beeg', uid: 'big-beeg-id' },
                    { chat_id: 'chat-mom', uid: 'me' },
                    { chat_id: 'chat-mom', uid: 'mom-id' },
                    { chat_id: 'new-chat-id', uid: 'me' },
                    { chat_id: 'new-chat-id', uid: 'nadia-id' },
                ],
                error: null,
            });
            mockProfilesByIds.mockResolvedValueOnce({
                data: [
                    { uid: 'big-beeg-id', display_name: 'Big Beeg' },
                    { uid: 'mom-id', display_name: 'Mom' },
                    { uid: 'nadia-id', display_name: 'Nadia' },
                ],
                error: null,
            });

            act(() => {
                triggerChatParticipantAdded({ chat_id: 'new-chat-id', uid: 'me' });
            });

            expect(await screen.findByText('Added to Nadia')).toBeInTheDocument();
            expect(screen.getByText('new')).toBeInTheDocument();

            // Toast's own action clears the glow too.
            const user = userEvent.setup();
            await user.click(screen.getByRole('button', { name: 'View' }));
            await waitFor(() => expect(screen.queryByText('new')).not.toBeInTheDocument());
        });
    });

    describe('realtime', () => {
        it('appends a live message to the open conversation', async () => {
            const user = userEvent.setup();
            renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');
            await user.click(screen.getByText('Big Beeg'));
            await screen.findByPlaceholderText('Message');

            act(() => {
                triggerRealtimeMessage({
                    message_id: 'live-1',
                    chat_id: 'chat-big-beeg',
                    sender_id: 'big-beeg-id',
                    content: 'yo new message',
                    sent_at: '2026-01-05T00:00:00Z',
                });
            });

            // Twice by design: the message bubble and the sidebar preview.
            expect(await screen.findAllByText('yo new message')).toHaveLength(2);
        });

        it("bumps a chat's preview and ordering when a live message arrives for a chat that isn't open", async () => {
            const { container } = renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');
            // Big Beeg sorts first initially (newer last_message_at).
            expect(container.textContent.indexOf('Big Beeg')).toBeLessThan(container.textContent.indexOf('Mom'));

            act(() => {
                triggerRealtimeMessage({
                    message_id: 'live-2',
                    chat_id: 'chat-mom',
                    sender_id: 'mom-id',
                    content: 'call me back',
                    sent_at: '2026-01-10T00:00:00Z',
                });
            });

            expect(await screen.findByText('call me back')).toBeInTheDocument();
            expect(container.textContent.indexOf('Mom')).toBeLessThan(container.textContent.indexOf('Big Beeg'));
        });

        it('does not duplicate our own message when its realtime echo arrives', async () => {
            const user = userEvent.setup();
            renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');
            await user.click(screen.getByText('Big Beeg'));

            const input = await screen.findByPlaceholderText('Message');
            const callsBefore = mockInsertMessage.mock.calls.length;
            await user.type(input, 'testing the compose bar');
            await user.click(screen.getByRole('button', { name: /send/i }));
            await waitFor(() => expect(mockInsertMessage.mock.calls.length).toBeGreaterThan(callsBefore));
            const [sentRow] = mockInsertMessage.mock.calls.at(-1);

            act(() => {
                triggerRealtimeMessage({ ...sentRow, sent_at: '2026-01-04T00:00:00Z' });
            });

            // 2, not 3: the optimistic bubble stays deduped, plus the sidebar preview.
            expect(screen.getAllByText('testing the compose bar')).toHaveLength(2);
        });

        it('re-authorizes on refocus without recreating a healthy channel', async () => {
            renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');
            await waitFor(() => expect(mockChannel).toHaveBeenCalled());
            const channelCallsBefore = mockChannel.mock.calls.length;
            const removeCallsBefore = mockRemoveChannel.mock.calls.length;

            Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
            await act(async () => {
                document.dispatchEvent(new Event('visibilitychange'));
            });

            await waitFor(() => expect(mockSetAuth).toHaveBeenCalledWith('test-token'));
            // Still 'joined' — refocus shouldn't tear down and rejoin.
            expect(mockRemoveChannel.mock.calls.length).toBe(removeCallsBefore);
            expect(mockChannel.mock.calls.length).toBe(channelCallsBefore);
        });

        it('recreates the channel on refocus if it is no longer joined', async () => {
            renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');
            await waitFor(() => expect(mockChannel).toHaveBeenCalled());
            const channelCallsBefore = mockChannel.mock.calls.length;
            const removeCallsBefore = mockRemoveChannel.mock.calls.length;

            setLatestChannelState('closed');
            Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
            await act(async () => {
                document.dispatchEvent(new Event('visibilitychange'));
            });

            await waitFor(() => expect(mockRemoveChannel.mock.calls.length).toBe(removeCallsBefore + 1));
            expect(mockChannel.mock.calls.length).toBe(channelCallsBefore + 1);
            expect(mockSetAuth).toHaveBeenCalledWith('test-token');
        });

        it('refetches the chat list when added to a new chat', async () => {
            renderWithProviders(<HomePage />);
            await screen.findByText('Big Beeg');
            // fetchChats' call count is the signal that onAdded actually ran.
            const callsBefore = mockMyParticipation.mock.calls.length;

            act(() => {
                triggerChatParticipantAdded();
            });

            await waitFor(() => expect(mockMyParticipation.mock.calls.length).toBeGreaterThan(callsBefore));
        });
    });
});
