import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
    it('renders without crashing', () => {
        renderWithProviders(<LandingPage />);
        expect(screen.getByText('WAFFLER')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /create account/i })).toHaveAttribute('href', '/register');
    });
});
