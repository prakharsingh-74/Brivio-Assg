import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AppLayout } from './components/Layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { AllRecordingsPage } from './pages/AllRecordingsPage';
import { NewRecordingPage } from './pages/NewRecordingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="h-screen">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/app" element={<AppLayout />}>
              <Route path="recordings" element={<AllRecordingsPage />} />
              <Route path="new" element={<NewRecordingPage />} />
              <Route path="" element={<Navigate to="/app/recordings" replace />} />
            </Route>
            <Route path="/" element={<Navigate to="/app/recordings" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;