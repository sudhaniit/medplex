import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import MedicalDashboard from './pages/MedicalDashboard';
import DeviceRiskChecker from './pages/DeviceRiskChecker';
import RiskAssessmentResult from './pages/RiskAssessmentResult';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminLogin from './pages/SuperAdminLogin';

// Unauthorized page component
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <p className="text-xl text-gray-600 mb-8">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()}
        className="btn-primary"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Not found page component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/super-admin-login" element={<SuperAdminLogin />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Hospital/Medical routes */}
              <Route 
                path="/medical-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['hospital', 'superadmin']}>
                    <MedicalDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/device-risk-checker" 
                element={
                  <ProtectedRoute allowedRoles={['hospital', 'superadmin']}>
                    <DeviceRiskChecker />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/risk-result" 
                element={
                  <ProtectedRoute allowedRoles={['hospital', 'superadmin']}>
                    <RiskAssessmentResult />
                  </ProtectedRoute>
                } 
              />

              {/* Manufacturer routes */}
              <Route 
                path="/manufacturer-dashboard" 
                element={
                  <ProtectedRoute requiredRole="manufacturer">
                    <ManufacturerDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Super Admin routes */}
              <Route 
                path="/super-admin-dashboard" 
                element={
                  <ProtectedRoute requiredRole="superadmin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;