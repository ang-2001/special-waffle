import { useNavigate } from 'react-router';
import { useEjectTransition } from './useEjectTransition';
import { TAPE_EJECT_MS } from '../components/atoms/TapeEject/TapeEject';

// Drives TapeEject's animation on a form before navigating away from it —
// [ejecting, ejectTo] pairs with FormCard's $ejecting prop.
export const useEjectNavigate = () => {
    const navigate = useNavigate();
    const [ejecting, runEject] = useEjectTransition(TAPE_EJECT_MS);

    const ejectTo = (path) => runEject(() => navigate(path));

    return [ejecting, ejectTo];
};

export default useEjectNavigate;
