import { describe, it, expect, vi } from 'vitest';

// Confirms each function calls the right RPC with the right shape — not
// that the RPC behaves correctly server-side, which needs a real database.
vi.mock('./supabaseClient', () => ({
    supabase: { rpc: vi.fn() },
}));

import { supabase } from './supabaseClient';
import { renameChat, addChatParticipant, leaveChat } from './chats';

describe('renameChat', () => {
    it('calls rename_chat with the chat id and title', async () => {
        supabase.rpc.mockResolvedValueOnce({ data: null, error: null });
        const { error } = await renameChat('chat-1', 'Trip planning');
        expect(supabase.rpc).toHaveBeenCalledWith('rename_chat', { p_chat_id: 'chat-1', p_title: 'Trip planning' });
        expect(error).toBeNull();
    });

    it('passes through an error without throwing', async () => {
        const rpcError = { message: 'Not a participant in this chat' };
        supabase.rpc.mockResolvedValueOnce({ data: null, error: rpcError });
        const { error } = await renameChat('chat-1', 'Trip planning');
        expect(error).toBe(rpcError);
    });
});

describe('addChatParticipant', () => {
    it('calls add_chat_participant with the chat id and the invitee', async () => {
        supabase.rpc.mockResolvedValueOnce({ data: null, error: null });
        const { error } = await addChatParticipant('chat-1', 'jules-id');
        expect(supabase.rpc).toHaveBeenCalledWith('add_chat_participant', { p_chat_id: 'chat-1', p_uid: 'jules-id' });
        expect(error).toBeNull();
    });

    it('passes through an error without throwing', async () => {
        const rpcError = { message: 'Can only add an accepted friend' };
        supabase.rpc.mockResolvedValueOnce({ data: null, error: rpcError });
        const { error } = await addChatParticipant('chat-1', 'stranger-id');
        expect(error).toBe(rpcError);
    });
});

describe('leaveChat', () => {
    it('calls leave_chat with the chat id', async () => {
        supabase.rpc.mockResolvedValueOnce({ data: null, error: null });
        const { error } = await leaveChat('chat-1');
        expect(supabase.rpc).toHaveBeenCalledWith('leave_chat', { p_chat_id: 'chat-1' });
        expect(error).toBeNull();
    });

    it('passes through an error without throwing', async () => {
        const rpcError = { message: 'network error' };
        supabase.rpc.mockResolvedValueOnce({ data: null, error: rpcError });
        const { error } = await leaveChat('chat-1');
        expect(error).toBe(rpcError);
    });
});
