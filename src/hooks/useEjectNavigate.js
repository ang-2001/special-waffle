import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TAPE_EJECT_MS } from '../components/atoms/TapeEject/TapeEject';

const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

// Drives TapeEject's animation on a form before navigating away from it —
// [ejecting, ejectTo] pairs with FormCard's $ejecting prop. Skips the delay
// entirely under prefers-reduced-motion.
export const useEjectNavigate = () => {
    const navigate = useNavigate();
    const [ejecting, setEjecting] = useState(false);

    const ejectTo = (path) => {
        if (prefersReducedMotion()) {
            navigate(path);
            return;
        }
        setEjecting(true);
        setTimeout(() => navigate(path), TAPE_EJECT_MS);
    };

    return [ejecting, ejectTo];
};

export default useEjectNavigate;
