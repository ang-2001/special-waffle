import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test-utils';
import HomePage from './HomePage';

describe('HomePage', () => {
    it('renders the sidebar with an empty conversation state by default', () => {
        renderWithProviders(<HomePage />);
        expect(screen.getByText('Waffler')).toBeInTheDocument();
        expect(screen.getByText('Big Beeg')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        expect(screen.getByText(/select a conversation/i)).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Message')).not.toBeInTheDocument();
    });

    it('opens a conversation when a chat is selected', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);

        await user.click(screen.getByText('Big Beeg'));

        expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
        expect(screen.getByText('online')).toBeInTheDocument();
        expect(screen.queryByText(/select a conversation/i)).not.toBeInTheDocument();
    });

    it('sends a message and appends it to that conversation only', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);

        await user.click(screen.getByText('Big Beeg'));
        const input = screen.getByPlaceholderText('Message');
        await user.type(input, 'testing the compose bar');
        await user.click(screen.getByRole('button', { name: /send/i }));

        expect(screen.getByText('testing the compose bar')).toBeInTheDocument();
        expect(input).toHaveValue('');

        await user.click(screen.getByText('Mom'));

        expect(screen.queryByText('testing the compose bar')).not.toBeInTheDocument();
    });
});
