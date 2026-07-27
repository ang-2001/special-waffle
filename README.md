# special-waffle

A React app with login/registration forms, built with [Vite](https://vitejs.dev/) and [styled-components](https://styled-components.com/).

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build (output in `dist/`)
- `npm run preview` — locally preview the production build
- `npm test` — run tests (Vitest + Testing Library)

## Project structure

Components are organized using [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/):

```
src/
├── theme/                  # design tokens (colors, typography, spacing) + ThemeProvider setup
├── components/
│   ├── atoms/               # smallest building blocks (Input, Button, Heading, ...)
│   ├── molecules/           # small compositions of atoms (LabeledInput, NameFieldRow, ...)
│   ├── organisms/           # self-contained sections (LoginForm, RegisterForm, Sidebar)
│   └── templates/           # page-level layout skeletons (AuthPageTemplate, HomeTemplate)
└── pages/                    # route-level components, thin compositions of templates + organisms
```

All colors, fonts, spacing, and radii live in `src/theme/tokens.js` — component styles pull from `theme.colors`/`theme.typography`/etc. rather than hardcoding values, so visual changes should generally start there.

## Known gaps

This is a work in progress. Currently:

- Forms are styled but not wired to any backend — submit handlers exist but don't do anything yet.
- No root (`/`) or 404 route is defined.
- The messaging feature (`HomePage`/`Sidebar`) is a placeholder stub.
- Referenced custom fonts (`vhs`, `vhs-bold`) expect files under `public/fonts/`, which aren't present in this checkout yet.
