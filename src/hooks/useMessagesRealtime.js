import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

// One channel per session covering every chat at once (chat_id=in.(...)
// filter, capped at 100 values — chats beyond that fall back to
// fetch-on-open). `onMessage` fires for every inserted row, including the
// caller's own sends, so MessageSection's upsert-by-id can reconcile them.
export const useMessagesRealtime = (chatIds, onMessage) => {
    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;

    const key = chatIds.join(',');

    useEffect(() => {
        if (chatIds.length === 0) return;

        const subscribe = () =>
            supabase
                .channel('messages:mine')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=in.(${key})` },
                    (payload) => onMessageRef.current(payload.new)
                )
                .subscribe();

        let channel = subscribe();

        // Defensive reconnect: a token that expired while backgrounded can
        // bring the channel back errored instead of self-healing. Re-auth
        // and verify it's actually joined on refocus, recreating if not.
        // `reconnecting` guards against overlapping runs from rapid
        // tab-switching.
        let reconnecting = false;
        const handleVisibility = async () => {
            if (document.visibilityState !== 'visible' || reconnecting) return;
            reconnecting = true;
            try {
                const { data } = await supabase.auth.getSession();
                if (!data.session) return;
                supabase.realtime.setAuth(data.session.access_token);
                if (channel.state !== 'joined') {
                    supabase.removeChannel(channel);
                    channel = subscribe();
                }
            } finally {
                reconnecting = false;
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            supabase.removeChannel(channel);
        };
        // key (not chatIds) is the real dependency — a new array reference
        // with the same ids shouldn't tear down and rejoin the channel.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
};
