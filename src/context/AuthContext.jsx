import { createContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Single source of truth for session + profile. See useAuth for the hook.
export const AuthContext = createContext(undefined);

const fetchProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('uid', userId)
        .single();
    return error ? null : data;
};

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        // Applies a session + its profile row as one unit, so a consumer
        // never sees "logged in" with a stale profile.
        const applySession = async (nextSession) => {
            if (!active) return;
            setSession(nextSession);

            // Realtime socket doesn't auto-pick-up a refreshed auth token.
            if (nextSession) supabase.realtime.setAuth(nextSession.access_token);

            if (!nextSession) {
                setProfile(null);
                setLoading(false);
                return;
            }

            const nextProfile = await fetchProfile(nextSession.user.id);
            if (!active) return;
            setProfile(nextProfile);
            setLoading(false);
        };

        supabase.auth.getSession()
            .then(({ data }) => applySession(data.session))
            .catch(() => {
                // Fall back to "logged out" rather than leave loading stuck true.
                if (!active) return;
                setSession(null);
                setProfile(null);
                setLoading(false);
            });

        // setTimeout avoids a deadlock if the callback awaits another
        // Supabase call (github.com/supabase/auth-js/issues/762).
        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setTimeout(() => {
                applySession(nextSession);
            }, 0);
        });

        return () => {
            active = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    const refreshProfile = async () => {
        if (!session) return;
        const nextProfile = await fetchProfile(session.user.id);
        setProfile(nextProfile);
    };

    // Updates land in local state directly from Postgres's returned row.
    const updateProfile = async (updates) => {
        if (!session) return { data: null, error: new Error('Not signed in') };
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('uid', session.user.id)
            .select()
            .single();
        if (!error) setProfile(data);
        return { data, error };
    };

    // supabase-js re-emits a session object (new reference, same user) on
    // INITIAL_SESSION and every token refresh — memoize so consumers don't
    // get a new `user` reference each time.
    const value = useMemo(
        () => ({
            session,
            user: session?.user ?? null,
            profile,
            loading,
            signUp: (credentials) => supabase.auth.signUp(credentials),
            signIn: (credentials) => supabase.auth.signInWithPassword(credentials),
            signOut: () => supabase.auth.signOut(),
            refreshProfile,
            updateProfile,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [session, profile, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
