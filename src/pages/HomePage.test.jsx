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

    it('sends a friend request and shows a local confirmation', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);

        await user.click(screen.getByRole('button', { name: 'Add friend' }));
        const input = await screen.findByPlaceholderText('Enter a username');

        await user.click(screen.getByRole('button', { name: /send request/i }));
        expect(await screen.findByText(/enter a username first/i)).toBeInTheDocument();

        await user.type(input, 'zephyr');
        await user.click(screen.getByRole('button', { name: /send request/i }));
        expect(await screen.findByText('Request sent to zephyr.')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /back to chats/i }));
        expect(await screen.findByText('Waffler')).toBeInTheDocument();
    });

    it('accepts and declines friend requests locally', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);

        await user.click(screen.getByRole('button', { name: 'Friend requests' }));
        expect(await screen.findByText('Requests · 2')).toBeInTheDocument();
        expect(screen.getByText('Nadia')).toBeInTheDocument();
        expect(screen.getByText('Theo')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Accept Nadia' }));
        expect(await screen.findByText('Requests · 1')).toBeInTheDocument();
        expect(screen.queryByText('Nadia')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Decline Theo' }));
        expect(await screen.findByText(/no pending requests/i)).toBeInTheDocument();
    });

    it('adds an accepted friend to the chat list and opens an empty thread for them', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />);

        await user.click(screen.getByRole('button', { name: 'Friend requests' }));
        await user.click(await screen.findByRole('button', { name: 'Accept Nadia' }));
        await user.click(screen.getByRole('button', { name: /back to chats/i }));

        const nadiaChatEntry = await screen.findByText('Nadia');
        await user.click(nadiaChatEntry);
        expect(await screen.findByPlaceholderText('Message')).toBeInTheDocument();
    });
});
