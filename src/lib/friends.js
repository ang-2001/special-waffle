import { supabase } from './supabaseClient';

// friendships' real columns are lowercase `uida`/`uidb` (Postgres folds
// unquoted identifiers). PostgREST matches column names exactly against
// its schema cache, so `.eq('uidA', ...)` would fail — always use
// lowercase here; local variables/return shapes can stay camelCase.

// friendships' PK requires uida < uidb — every write needs canonical order.
const canonicalPair = (meId, otherId) => (meId < otherId ? [meId, otherId] : [otherId, meId]);

// Looks up a profile by its unique display_name. The column is citext, so
// Postgres already compares it case-insensitively — no need for ilike.
export const findProfileByDisplayName = async (displayName) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('uid, display_name')
        .eq('display_name', displayName)
        .maybeSingle();
    return { data, error };
};

// Sends a friend request from `meId` to `otherId`. Status defaults to
// 'pending' at the column level, which is also all the insert RLS policy
// allows.
export const sendFriendRequest = async (meId, otherId) => {
    const [uidA, uidB] = canonicalPair(meId, otherId);
    const { data, error } = await supabase
        .from('friendships')
        .insert({ uida: uidA, uidb: uidB, requested_by: meId })
        .select()
        .single();
    return { data, error };
};

// The existing friendship/request row between two users, if any — used to
// turn a (uidA, uidB) primary-key conflict from sendFriendRequest into a
// specific message instead of a generic "already exists."
export const getFriendshipStatus = async (meId, otherId) => {
    const [uidA, uidB] = canonicalPair(meId, otherId);
    const { data, error } = await supabase
        .from('friendships')
        .select('status, requested_by')
        .eq('uida', uidA)
        .eq('uidb', uidB)
        .maybeSingle();
    return { data, error };
};

// Pending requests sent TO the current user. Fetch-then-join: get the
// rows, then look up display names for whichever side isn't `meId`.
export const fetchIncomingRequests = async (meId) => {
    const { data, error } = await supabase
        .from('friendships')
        .select('uida, uidb, requested_at')
        .eq('status', 'pending')
        .neq('requested_by', meId)
        .or(`uida.eq.${meId},uidb.eq.${meId}`);
    if (error) return { data: null, error };
    if (data.length === 0) return { data: [], error: null };

    const otherIds = data.map((row) => (row.uida === meId ? row.uidb : row.uida));
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('uid, display_name')
        .in('uid', otherIds);
    if (profileError) return { data: null, error: profileError };

    const nameById = new Map(profiles.map((p) => [p.uid, p.display_name]));
    const requests = data.map((row) => {
        const otherId = row.uida === meId ? row.uidb : row.uida;
        return {
            uidA: row.uida,
            uidB: row.uidb,
            otherId,
            name: nameById.get(otherId) ?? 'Unknown',
            requestedAt: row.requested_at,
        };
    });
    return { data: requests, error: null };
};

// All accepted friends — the real friend list, independent of whether a
// chat exists with any of them yet (see lib/chats.js for that half).
export const fetchFriends = async (meId) => {
    const { data, error } = await supabase
        .from('friendships')
        .select('uida, uidb')
        .eq('status', 'accepted')
        .or(`uida.eq.${meId},uidb.eq.${meId}`);
    if (error) return { data: null, error };
    if (data.length === 0) return { data: [], error: null };

    const otherIds = data.map((row) => (row.uida === meId ? row.uidb : row.uida));
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('uid, display_name')
        .in('uid', otherIds);
    if (profileError) return { data: null, error: profileError };

    const friends = profiles.map((p) => ({ uid: p.uid, name: p.display_name }));
    return { data: friends, error: null };
};

// Accepts or declines a pending request. Only the recipient can call this
// (enforced by RLS — the update policy excludes the requester).
export const respondToRequest = async (uidA, uidB, status) => {
    const { data, error } = await supabase
        .from('friendships')
        .update({ status, responded_at: new Date().toISOString() })
        .eq('uida', uidA)
        .eq('uidb', uidB)
        .select()
        .single();
    return { data, error };
};
