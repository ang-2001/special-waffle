import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// profileSingle backs both AuthContext chains (fetchProfile, updateProfile)
// so tests can set the current user's profile row via one handle.
vi.mock('./lib/supabaseClient', () => {
    const profileSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    return {
        supabase: {
            auth: {
                getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
                onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
                signUp: vi.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
                signInWithPassword: vi.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
                signOut: vi.fn().mockResolvedValue({ error: null }),
            },
            // Not exercised meaningfully by these routing tests, just needs to not throw.
            realtime: { setAuth: vi.fn() },
            channel: vi.fn(() => {
                const chan = {
                    on: vi.fn(() => chan),
                    subscribe: vi.fn(() => {
                        chan.state = 'joined';
                        return chan;
                    }),
                };
                return chan;
            }),
            removeChannel: vi.fn(),
            rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
            from: vi.fn((table) => {
                // Empty participation short-circuits fetchChats before it touches 'chats'.
                if (table === 'chat_participants') {
                    return { select: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) })) };
                }
                // Sidebar's requests badge fetches on every mount too.
                if (table === 'friendships') {
                    return {
                        select: vi.fn(() => ({
                            eq: vi.fn(() => ({
                                neq: vi.fn(() => ({ or: vi.fn().mockResolvedValue({ data: [], error: null }) })),
                            })),
                        })),
                    };
                }
                return {
                    select: vi.fn(() => ({ eq: vi.fn(() => ({ single: profileSingle })) })),
                    update: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn(() => ({ single: profileSingle })) })) })),
                };
            }),
        },
        mockProfileSingle: profileSingle,
    };
});
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { supabase, mockProfileSingle } from './lib/supabaseClient';
import App from './App';

// App owns its own BrowserRouter (nested routers throw) — set the URL
// directly and let it pick up window.location on mount.
const renderAt = (path) => {
    window.history.pushState({}, '', path);
    return render(
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    );
};

describe('App routing', () => {
    it('redirects the root path to the landing page', () => {
        renderAt('/');
        expect(screen.getByText('WAFFLER')).toBeInTheDocument();
    });

    it('renders the 404 page for an unknown path', () => {
        renderAt('/this-page-does-not-exist');
        expect(screen.getByText(/this tape isn't in the rack/i)).toBeInTheDocument();
    });

    it('redirects /home to /login when no session exists', async () => {
        renderAt('/home');
        await waitFor(() => {
            expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
        });
    });

    it('renders /home when a session exists', async () => {
        supabase.auth.getSession.mockResolvedValueOnce({
            data: { session: { user: { id: 'test-user' } } },
            error: null,
        });
        mockProfileSingle.mockResolvedValueOnce({
            data: { uid: 'test-user', display_name: 'Test User', onboarding_completed: true },
            error: null,
        });
        renderAt('/home');
        await waitFor(() => {
            expect(screen.getByText('Waffler')).toBeInTheDocument();
        });
    });

    it('sends /onboarding to /home once onboarding_completed is true', async () => {
        supabase.auth.getSession.mockResolvedValueOnce({
            data: { session: { user: { id: 'test-user' } } },
            error: null,
        });
        mockProfileSingle.mockResolvedValueOnce({
            data: { uid: 'test-user', display_name: 'Test User', onboarding_completed: true },
            error: null,
        });
        renderAt('/onboarding');
        await waitFor(() => {
            expect(screen.getByText('Waffler')).toBeInTheDocument();
        });
    });

    it('renders /onboarding while onboarding_completed is still false', async () => {
        supabase.auth.getSession.mockResolvedValueOnce({
            data: { session: { user: { id: 'test-user' } } },
            error: null,
        });
        mockProfileSingle.mockResolvedValueOnce({
            data: { uid: 'test-user', display_name: 'Test User', onboarding_completed: false },
            error: null,
        });
        renderAt('/onboarding');
        await waitFor(() => {
            expect(screen.getByText('Welcome to Waffler')).toBeInTheDocument();
        });
    });
});
