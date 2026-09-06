import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { AmbientEffects } from './components/molecules/AmbientEffects/AmbientEffects';
import { RouteTransition } from './components/molecules/RouteTransition/RouteTransition';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './routes/RequireAuth';
import { RequireOnboardingIncomplete } from './routes/RequireOnboardingIncomplete';

function App() {
  return (
    <AuthProvider>
      <AmbientEffects />
      <BrowserRouter>
        <RouteTransition>
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/onboarding"
              element={
                <RequireAuth>
                  <RequireOnboardingIncomplete>
                    <OnboardingPage />
                  </RequireOnboardingIncomplete>
                </RequireAuth>
              }
            />
            <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </RouteTransition>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
