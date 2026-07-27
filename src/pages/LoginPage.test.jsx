import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
    it('renders without crashing', () => {
        renderWithProviders(<LoginPage />);
        expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
});
