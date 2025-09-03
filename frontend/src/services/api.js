import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hospital-device-risk-1036863235167.asia-south1.run.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || 'An error occurred';

    if (status === 401) {
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (status >= 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Hospital user registration
  registerHospital: (data) => api.post('/register', data),
  
  // Hospital user login
  loginHospital: (data) => {
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);
    return api.post('/login', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  
  // Manufacturer registration
  registerManufacturer: (data) => api.post('/register/manufacturer', data),
  
  // Manufacturer login
  loginManufacturer: (data) => {
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);
    return api.post('/login/manufacturer', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

// Risk assessment API calls
export const riskAPI = {
  // Check device risk
  checkRisk: (data) => api.post('/risk/check', data),
  
  // Report device failure
  reportFailure: (data) => api.post('/report_failure', data),
  
  // Submit feedback
  submitFeedback: (data) => api.post('/continuous_learning', data),
};

// Device API calls
export const deviceAPI = {
  // Get all devices
  getAllDevices: (params) => api.get('/devices', { params }),
  
  // Get device by ID
  getDeviceById: (id) => api.get(`/devices/${id}`),
  
  // Get manufacturers for autocomplete
  getManufacturers: (params) => api.get('/devices/manufacturers', { params }),
};

// Manufacturer API calls
export const manufacturerAPI = {
  // Get manufacturer devices
  getDevices: () => api.get('/manufacturer/devices'),
  
  // Get manufacturer dashboard data
  getDashboard: () => api.get('/manufacturer/dashboard'),
};

// Admin API calls
export const adminAPI = {
  // Get all users
  getUsers: () => api.get('/admin/users'),
  
  // Get all manufacturers
  getManufacturers: () => api.get('/admin/manufacturers'),
  
  // Toggle user activation
  toggleUserActivation: (data) => api.post('/admin/activate_user', data),
  
  // Toggle manufacturer activation
  toggleManufacturerActivation: (data) => api.post('/admin/activate_manufacturer', data),
  
  // Delete user
  deleteUser: (email) => api.delete(`/admin/delete_user/${encodeURIComponent(email)}`),
  
  // Delete manufacturer
  deleteManufacturer: (email) => api.delete(`/admin/delete_manufacturer/${encodeURIComponent(email)}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;