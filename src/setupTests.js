// jest-dom adds custom vitest matchers (toHaveTextContent, etc).
import '@testing-library/jest-dom/vitest';

// Mocks registered here don't propagate to modules imported later in the
// graph — every test touching auth needs its own inline
// `vi.mock('<path to>/lib/supabaseClient', ...)` at its own top (see
// App.test.jsx). A shared `__mocks__` version was tried and was flaky
// under a full parallel run — don't reintroduce it without confirming
// Vitest's automock resolution is reliable under parallel execution.
