import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// { session, user, loading, signUp, signIn, signOut } — see AuthContext
// for what each of those actually does.
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (ctx === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
};

export default useAuth;
