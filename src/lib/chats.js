import { supabase } from './supabaseClient';

// Every chat you're a participant in. Display name is the title if set,
// otherwise the other participants' names joined together.
export const fetchChats = async (meId) => {
    const { data: myParticipation, error: participationError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('uid', meId);
    if (participationError) {
        console.error('fetchChats: chat_participants (my participation) failed', participationError);
        return { data: null, error: participationError };
    }
    if (myParticipation.length === 0) return { data: [], error: null };

    const chatIds = myParticipation.map((row) => row.chat_id);

    const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select('chat_id, title, last_message_preview, last_message_at, created_at')
        .in('chat_id', chatIds);
    if (chatsError) {
        console.error('fetchChats: chats select failed', chatsError);
        return { data: null, error: chatsError };
    }

    const { data: participants, error: participantsError } = await supabase
        .from('chat_participants')
        .select('chat_id, uid')
        .in('chat_id', chatIds);
    if (participantsError) {
        console.error('fetchChats: chat_participants (all participants) failed', participantsError);
        return { data: null, error: participantsError };
    }

    const otherIdsByChat = new Map();
    participants.forEach((row) => {
        if (row.uid === meId) return;
        const list = otherIdsByChat.get(row.chat_id) ?? [];
        list.push(row.uid);
        otherIdsByChat.set(row.chat_id, list);
    });

    const allOtherIds = Array.from(new Set(participants.map((p) => p.uid).filter((uid) => uid !== meId)));
    let nameById = new Map();
    if (allOtherIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('uid, display_name')
            .in('uid', allOtherIds);
        if (profilesError) {
            console.error('fetchChats: profiles select failed', profilesError);
            return { data: null, error: profilesError };
        }
        nameById = new Map(profiles.map((p) => [p.uid, p.display_name]));
    }

    const merged = chats.map((chat) => {
        const otherIds = otherIdsByChat.get(chat.chat_id) ?? [];
        const otherNames = otherIds.map((uid) => nameById.get(uid) ?? 'Unknown');
        return {
            chatId: chat.chat_id,
            title: chat.title,
            name: chat.title ?? (otherNames.length > 0 ? otherNames.join(', ') : 'Empty chat'),
            // Lets HomeTemplate.handleCreateChat check for an existing
            // match without a round trip.
            participantIds: otherIds,
            // Same ids with names — ChatInfoPanel reads this directly.
            participants: otherIds.map((uid, i) => ({ uid, name: otherNames[i] })),
            preview: chat.last_message_preview,
            lastMessageAt: chat.last_message_at,
            createdAt: chat.created_at,
        };
    });

    // Fall back to created_at when there's no last message yet.
    merged.sort((a, b) => new Date(b.lastMessageAt ?? b.createdAt) - new Date(a.lastMessageAt ?? a.createdAt));

    return { data: merged, error: null };
};

// Wraps the create_chat RPC (security definer; every invitee must be an
// accepted friend). The RPC is the real authority for dedup — the client
// fast-path in HomeTemplate is just an optimization, not a security gate.
export const createChat = async (otherUserIds, title = null) => {
    const { data, error } = await supabase.rpc('create_chat', {
        other_user_ids: otherUserIds,
        chat_title: title,
    });
    if (error) console.error('createChat: create_chat rpc failed', error);
    return { data, error };
};

// Renaming clears back to the joined-participant-names display when given
// a blank/whitespace-only title — not an error, see rename_chat itself.
export const renameChat = async (chatId, title) => {
    const { error } = await supabase.rpc('rename_chat', { p_chat_id: chatId, p_title: title });
    if (error) console.error('renameChat: rename_chat rpc failed', error);
    return { error };
};

// Caller must be a participant of chatId and an accepted friend of uid.
export const addChatParticipant = async (chatId, uid) => {
    const { error } = await supabase.rpc('add_chat_participant', { p_chat_id: chatId, p_uid: uid });
    if (error) console.error('addChatParticipant: add_chat_participant rpc failed', error);
    return { error };
};

// Self-removal only — leaving a chat you're not in (or leaving twice) is
// a harmless no-op, not an error, same idempotent spirit as addChatParticipant.
export const leaveChat = async (chatId) => {
    const { error } = await supabase.rpc('leave_chat', { p_chat_id: chatId });
    if (error) console.error('leaveChat: leave_chat rpc failed', error);
    return { error };
};
