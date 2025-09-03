import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

const Register = () => {
  const [userType, setUserType] = useState('hospital'); // 'hospital' or 'manufacturer'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (userType === 'hospital') {
        response = await authAPI.registerHospital({
          email: data.email,
          password: data.password,
          hospital_name: data.hospital_name
        });
      } else {
        response = await authAPI.registerManufacturer({
          email: data.email,
          password: data.password,
          manufacturer_name: data.manufacturerName
        });
      }

      toast.success('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-brand-blue hover:text-blue-500"
            >
              sign in to existing account
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
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                type="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {userType === 'hospital' ? (
              <div>
                <label htmlFor="hospital_name" className="block text-sm font-medium text-gray-700">
                  Hospital Name
                </label>
                <input
                  {...register('hospital_name', {
                    required: 'Hospital name is required',
                    minLength: {
                      value: 2,
                      message: 'Hospital name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                  placeholder="Enter hospital name"
                />
                {errors.hospital_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.hospital_name.message}</p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="manufacturerName" className="block text-sm font-medium text-gray-700">
                    Manufacturer Name
                  </label>
                  <input
                    {...register('manufacturerName', {
                      required: 'Manufacturer name is required',
                      minLength: {
                        value: 2,
                        message: 'Manufacturer name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                    placeholder="Enter manufacturer name"
                  />
                  {errors.manufacturerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.manufacturerName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register('description', {
                      maxLength: {
                        value: 500,
                        message: 'Description cannot exceed 500 characters'
                      }
                    })}
                    rows={3}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                    placeholder="Brief description of your company"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website (Optional)
                  </label>
                  <input
                    {...register('website', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL (starting with http:// or https://)'
                      }
                    })}
                    type="url"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                    placeholder="https://yourcompany.com"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type="password"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;