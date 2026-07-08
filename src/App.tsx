import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MarketPage } from './pages/MarketPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { DocsPage } from './pages/DocsPage';
import { AppNav } from './components/AppNav';
import './index.css';

function App() {
  return (
    <Router>
      <AppNav />
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/app"         element={<Dashboard />} />
        <Route path="/market/:id"  element={<MarketPage />} />
        <Route path="/docs"        element={<DocsPage />} />
        <Route path="/developers"  element={<DevelopersPage />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
