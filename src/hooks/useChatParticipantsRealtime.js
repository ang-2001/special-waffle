import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

// Filtered by your own uid, for finding out about a chat you don't know
// about yet. Safe to expose live: is_chat_participant() gates a new row
// to only the added uid. `onAdded(row)` gets the raw { chat_id, uid } row.
export const useChatParticipantsRealtime = (userId, onAdded) => {
    const onAddedRef = useRef(onAdded);
    onAddedRef.current = onAdded;

    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('chat_participants:mine')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_participants', filter: `uid=eq.${userId}` },
                (payload) => onAddedRef.current(payload.new)
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);
};
