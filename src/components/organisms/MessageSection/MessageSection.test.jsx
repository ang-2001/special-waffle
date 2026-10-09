import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../theme/theme';
import MessageSection from './MessageSection';
import { fetchMessages } from '../../../lib/messages';

vi.mock('../../../lib/messages', () => ({
    fetchMessages: vi.fn(),
    sendMessage: vi.fn(),
}));
vi.mock('../../../lib/friends', () => ({ fetchFriends: vi.fn() }));
vi.mock('../../../lib/chats', () => ({ addChatParticipant: vi.fn() }));

const participants = [
    { uid: 'alice-id', name: 'alice' },
    { uid: 'bob-id', name: 'bob' },
];

const msg = (id, sender, minute) => ({
    message_id: id,
    chat_id: 'chat-1',
    sender_id: sender,
    content: `message ${id}`,
    sent_at: `2026-01-01T10:${String(minute).padStart(2, '0')}:00Z`,
});

const renderSection = async (messages) => {
    fetchMessages.mockResolvedValueOnce({ data: messages, error: null });
    render(
        <ThemeProvider theme={theme}>
            <MessageSection chatId="chat-1" chatName="Weekend Crew" participants={participants} userId="me" />
        </ThemeProvider>
    );
    await screen.findByText(`message ${messages[0].message_id}`);
};

describe('MessageSection', () => {
    it("labels each avatar with its sender's initial, not the chat name's", async () => {
        await renderSection([msg('1', 'alice-id', 0), msg('2', 'bob-id', 1), msg('3', 'gone-id', 2)]);

        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        // Someone who has left the chat isn't in participants.
        expect(screen.getByText('?')).toBeInTheDocument();
        // Only the header avatar carries the chat name's initial.
        expect(screen.getAllByText('W')).toHaveLength(1);
    });

    it('shows one avatar and one timestamp per run of messages from the same sender', async () => {
        await renderSection([
            msg('1', 'alice-id', 0),
            msg('2', 'alice-id', 1),
            msg('3', 'alice-id', 2),
            msg('4', 'me', 3),
            msg('5', 'me', 3),
            msg('6', 'alice-id', 4),
            // A long pause starts a new run even from the same sender.
            msg('7', 'alice-id', 30),
        ]);

        expect(screen.getAllByText('A')).toHaveLength(3);
        // Runs: alice 1-3, me 4-5, alice 6, alice 7.
        // Plus one for the header clock.
        expect(screen.getAllByText(/\d:\d\d/)).toHaveLength(4 + 1);
    });
});
