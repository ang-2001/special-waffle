import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import NotFoundPage from './NotFoundPage';

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

describe('NotFoundPage', () => {
    it('renders a way back to the app', () => {
        renderWithProviders(<NotFoundPage />);
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /back to waffler/i })).toHaveAttribute('href', '/landing');
    });
});
