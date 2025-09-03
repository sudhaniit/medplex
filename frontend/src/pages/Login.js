import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [userType, setUserType] = useState('hospital'); // 'hospital' or 'manufacturer'
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const getDefaultRedirect = (role) => {
    switch (role) {
      case 'superadmin':
        return '/super-admin-dashboard';
      case 'manufacturer':
        return '/manufacturer-dashboard';
      default:
        return '/medical-dashboard';
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (userType === 'hospital') {
        response = await authAPI.loginHospital(data);
      } else {
        response = await authAPI.loginManufacturer(data);
      }

      const { access_token } = response.data;
      // Create user object from token payload
      const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
      const user = {
        email: tokenPayload.sub,
        role: tokenPayload.role
      };
      login(user, access_token);
      
      const redirectPath = location.state?.from?.pathname || getDefaultRedirect(user.role);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-brand-blue">
            <span className="text-white font-bold text-xl">MD</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-brand-blue hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* User Type Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setUserType('hospital')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              userType === 'hospital'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hospital User
          </button>
          <button
            type="button"
            onClick={() => setUserType('manufacturer')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              userType === 'manufacturer'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Manufacturer
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {userType === 'manufacturer' ? 'Email or Company Name' : 'Email Address'}
              </label>
              <input
                {...register('email', {
                  required: 'This field is required',
                  ...(userType === 'hospital' && {
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address'
                    }
                  })
                })}
                type={userType === 'hospital' ? 'email' : 'text'}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                placeholder={userType === 'manufacturer' ? 'Enter email or company name' : 'Enter your email'}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 1,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type="password"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="spinner mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Demo Credentials:
            </p>
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p><strong>Hospital:</strong> alice@cityhospital.com / password123</p>
              <p><strong>Manufacturer:</strong> contact@meditech.com / manufacturer123</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link 
                to="/super-admin-login" 
                className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Super Admin Access
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;