import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test-utils';
import HomePage from './HomePage';

describe('HomePage', () => {
    it('renders without crashing', () => {
        renderWithProviders(<HomePage />);
        expect(screen.getByText('Friends')).toBeInTheDocument();
    });
});
