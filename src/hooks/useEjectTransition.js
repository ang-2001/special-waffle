import { useState } from 'react';

const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

// Generic "eject, then do X" timing primitive: exposes [transitioning,
// runEject] — set a caller's own $ejecting-style prop from `transitioning`
// to drive an eject CSS animation, then runEject(callback) waits
// durationMs before calling back, skipping the wait entirely under
// prefers-reduced-motion. useEjectNavigate wraps this for the
// Login/Register -> Home hand-off; Sidebar's tape-swap uses it directly.
export const useEjectTransition = (durationMs) => {
    const [transitioning, setTransitioning] = useState(false);

    const runEject = (callback) => {
        if (prefersReducedMotion()) {
            callback();
            return;
        }
        setTransitioning(true);
        setTimeout(() => {
            setTransitioning(false);
            callback();
        }, durationMs);
    };

    return [transitioning, runEject];
};

export default useEjectTransition;
