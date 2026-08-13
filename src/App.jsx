import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router';
import RegisterPage from './pages/RegisterPage';
import { AmbientEffects } from './components/molecules/AmbientEffects/AmbientEffects';
import { RouteTransition } from './components/molecules/RouteTransition/RouteTransition';

function App() {
  return (
    <>
      <AmbientEffects />
      <BrowserRouter>
        <RouteTransition>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </RouteTransition>
      </BrowserRouter>
    </>
  );
}

export default App;
