import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout, isHospital, isManufacturer, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
            MD
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-brand-blue">
              Medical Device Risk Assessment
            </h1>
            <p className="text-xs text-gray-500">Assess risks. Improve quality.</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 md:gap-6">
          <Link 
            className="text-sm text-gray-700 hover:text-brand-blue transition-colors" 
            to="/"
          >
            Home
          </Link>

          {isHospital() && (
            <>
              <Link 
                className="text-sm text-gray-700 hover:text-brand-blue transition-colors" 
                to="/medical-dashboard"
              >
                Medical Dashboard
              </Link>
              <Link 
                className="text-sm text-gray-700 hover:text-brand-blue transition-colors" 
                to="/device-risk-checker"
              >
                Risk Checker
              </Link>
            </>
          )}

          {isManufacturer() && (
            <Link 
              className="text-sm text-gray-700 hover:text-brand-blue transition-colors" 
              to="/manufacturer-dashboard"
            >
              Manufacturer Dashboard
            </Link>
          )}

          {isSuperAdmin() && (
            <Link 
              className="text-sm text-gray-700 hover:text-brand-blue transition-colors" 
              to="/super-admin-dashboard"
            >
              Super Admin Dashboard
            </Link>
          )}

          {!user && (
            <>
              <Link 
                className="px-3 py-1.5 rounded-md text-sm text-brand-blue hover:bg-blue-50 transition-colors" 
                to="/login"
              >
                Login
              </Link>
              <Link 
                className="px-3 py-1.5 rounded-md text-sm bg-brand-green text-white hover:bg-green-600 transition-colors" 
                to="/register"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Welcome, {user.hospitalName || user.name || user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;