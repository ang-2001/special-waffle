import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';

// Wraps components with the providers they need at runtime (ThemeProvider
// for styled-components, Router for react-router's Link) so page-level
// smoke tests don't have to repeat this setup.
export const renderWithProviders = (ui, { route = '/' } = {}) =>
    render(
        <MemoryRouter initialEntries={[route]}>
            <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </MemoryRouter>
    );

export * from '@testing-library/react';
