import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test-utils';
import RegisterPage from './RegisterPage';

describe('RegisterPage', () => {
    it('renders without crashing', () => {
        renderWithProviders(<RegisterPage />);
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('shows validation errors on empty submit', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RegisterPage />);

        await user.click(screen.getByRole('button', { name: /create account/i }));

        expect(screen.getByText('Email is required.')).toBeInTheDocument();
        expect(screen.getByText('First name is required.')).toBeInTheDocument();
        expect(screen.getByText('Password is required.')).toBeInTheDocument();
        expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
    });
});
