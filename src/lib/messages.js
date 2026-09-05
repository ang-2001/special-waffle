import { supabase } from './supabaseClient';

// Every message in a chat, oldest first — MessageSection renders top to
// bottom with the newest at the end, same convention as every chat app.
export const fetchMessages = async (chatId) => {
    const { data, error } = await supabase
        .from('messages')
        .select('message_id, chat_id, sender_id, sent_at, content')
        .eq('chat_id', chatId)
        .order('sent_at', { ascending: true });
    if (error) console.error('fetchMessages: messages select failed', error);
    return { data, error };
};

// message_id is a client-generated UUIDv7, not a DB default — lets the
// realtime echo reconcile by id against the optimistic bubble already rendered.
export const sendMessage = async (chatId, senderId, content, messageId) => {
    const { data, error } = await supabase
        .from('messages')
        .insert({ message_id: messageId, chat_id: chatId, sender_id: senderId, content })
        .select('message_id, chat_id, sender_id, sent_at, content')
        .single();
    if (error) console.error('sendMessage: messages insert failed', error);
    return { data, error };
};
