import { describe, it, expect } from 'vitest';
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
});
