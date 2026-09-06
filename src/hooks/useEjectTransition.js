import { useState } from 'react';

const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

// [transitioning, runEject] — drive an eject animation from
// `transitioning`, then runEject(callback) waits durationMs before
// calling back (skipped under prefers-reduced-motion).
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
