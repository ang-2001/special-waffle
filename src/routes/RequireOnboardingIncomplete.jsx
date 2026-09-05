import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

// Bounces to /home once onboarding_completed is true. Doesn't check
// `session` itself — nest inside RequireAuth for that.
export const RequireOnboardingIncomplete = ({ children }) => {
    const { profile, loading } = useAuth();

    if (loading) return null;
    if (profile?.onboarding_completed) return <Navigate to="/home" replace />;

    return children;
};

export default RequireOnboardingIncomplete;
