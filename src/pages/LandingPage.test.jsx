import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import LandingPage from './LandingPage';

vi.mock('../lib/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
            signUp: vi.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
            signInWithPassword: vi.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
            signOut: vi.fn().mockResolvedValue({ error: null }),
        },
    },
}));

describe('LandingPage', () => {
    it('renders without crashing', () => {
        renderWithProviders(<LandingPage />);
        expect(screen.getByText('WAFFLER')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /create account/i })).toHaveAttribute('href', '/register');
    });
});
