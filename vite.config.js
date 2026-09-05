import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/setupTests.js'],
        globals: true,
        // Full-suite runs were intermittently throwing unrelated errors (a
        // bad module mock resolution once, an undefined "config" read
        // another time) that never reproduced on an immediate rerun or in
        // an isolated single-file run — a signature of a race between test
        // files sharing state under worker parallelism, not a real bug in
        // the code under test. Running files sequentially trades a small
        // amount of speed (this suite is tiny) for deterministic results.
        fileParallelism: false,
        // If flakiness like the above ever comes back despite this: clear
        // node_modules/.vite (Vite's dep-optimizer cache) before assuming
        // it's a real regression — a stale/corrupted copy of that cache
        // reproduced the exact same symptom independently of parallelism.
    },
});
