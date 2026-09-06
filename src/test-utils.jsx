import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';

// Wraps components with the providers they need at runtime (Theme, Router,
// AuthProvider) so page-level smoke tests don't repeat this setup. Each
// test file mocks lib/supabaseClient itself — see setupTests.js.
export const renderWithProviders = (ui, { route = '/' } = {}) =>
    render(
        <MemoryRouter initialEntries={[route]}>
            <ThemeProvider theme={theme}>
                <AuthProvider>{ui}</AuthProvider>
            </ThemeProvider>
        </MemoryRouter>
    );

export * from '@testing-library/react';
