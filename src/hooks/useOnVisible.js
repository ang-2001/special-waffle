import { useEffect, useRef } from 'react';

// Runs `callback` whenever the tab becomes visible again — used to
// revalidate what a dropped realtime connection might have missed, since
// Postgres Changes has no catch-up log for events that happened while away.
export const useOnVisible = (callback) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') callbackRef.current();
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);
};
