import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test-utils';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
    it('renders without crashing', () => {
        renderWithProviders(<LoginPage />);
        expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('shows validation errors on empty submit', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);

        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(screen.getByText('Email is required.')).toBeInTheDocument();
        expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });
});
