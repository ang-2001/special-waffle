import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
    it('renders without crashing', () => {
        renderWithProviders(<LandingPage />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
});
