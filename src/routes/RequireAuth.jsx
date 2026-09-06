import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

// Route guard: redirects to /login unless a session actually exists.
// AuthContext's own state (session/loading) is the single source of truth
// here — this component makes no Supabase calls of its own.
export const RequireAuth = ({ children }) => {
    const { session, loading } = useAuth();

    if (loading) return null;
    if (!session) return <Navigate to="/login" replace />;

    return children;
};

export default RequireAuth;
