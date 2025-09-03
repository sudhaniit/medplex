import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { riskAPI, deviceAPI } from '../services/api';

const DeviceRiskChecker = () => {
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [recentChecks, setRecentChecks] = useState([]);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const manufacturerName = watch('manufacturerName');

  // Load manufacturers for autocomplete
  useEffect(() => {
    const loadManufacturers = async () => {
      try {
        const response = await deviceAPI.getManufacturers();
        setManufacturers(response.data.data);
      } catch (error) {
        console.error('Error loading manufacturers:', error);
      }
    };
    loadManufacturers();
  }, []);

  // Load recent risk checks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentRiskChecks');
    if (stored) {
      try {
        setRecentChecks(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading recent checks:', error);
      }
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await riskAPI.checkRisk({
        manufacturer_name: data.manufacturerName,
        device_name: data.deviceName,
        country: 'USA'
      });

      const result = response.data.data;
      
      // Store result for the results page
      sessionStorage.setItem('riskAssessmentResult', JSON.stringify(result));
      
      // Add to recent checks
      const newCheck = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        manufacturer: data.manufacturerName,
        device: data.deviceName,
        riskClass: result.device.riskClass,
        riskPercentage: result.device.riskPercentage
      };
      
      const updatedChecks = [newCheck, ...recentChecks.slice(0, 9)]; // Keep last 10
      setRecentChecks(updatedChecks);
      localStorage.setItem('recentRiskChecks', JSON.stringify(updatedChecks));
      
      // Navigate to results page
      navigate('/risk-result');
    } catch (error) {
      const message = error.response?.data?.message || 'Risk assessment failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleManufacturerSelect = (manufacturer) => {
    setValue('manufacturerName', manufacturer.name);
  };

  const getRiskColor = (riskClass) => {
    switch (riskClass) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Risk Checker</h1>
        <p className="text-lg text-gray-600">
          Assess the risk level of medical devices from various manufacturers
        </p>
      </div>

      {/* Risk Assessment Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">New Risk Assessment</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="manufacturerName" className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer Name
              </label>
              <div className="relative">
                <input
                  {...register('manufacturerName', {
                    required: 'Manufacturer name is required',
                    minLength: {
                      value: 2,
                      message: 'Manufacturer name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="Enter manufacturer name"
                  list="manufacturers"
                />
                <datalist id="manufacturers">
                  {manufacturers.map((manufacturer) => (
                    <option key={manufacturer._id} value={manufacturer.name} />
                  ))}
                </datalist>
              </div>
              {errors.manufacturerName && (
                <p className="mt-1 text-sm text-red-600">{errors.manufacturerName.message}</p>
              )}
              
              {/* Manufacturer suggestions */}
              {manufacturerName && manufacturerName.length > 1 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-40 overflow-y-auto">
                  {manufacturers
                    .filter(m => m.name.toLowerCase().includes(manufacturerName.toLowerCase()))
                    .slice(0, 5)
                    .map((manufacturer) => (
                      <button
                        key={manufacturer._id}
                        type="button"
                        onClick={() => handleManufacturerSelect(manufacturer)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      >
                        {manufacturer.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 mb-2">
                Device Name
              </label>
              <input
                {...register('deviceName', {
                  required: 'Device name is required',
                  minLength: {
                    value: 2,
                    message: 'Device name must be at least 2 characters'
                  }
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                placeholder="Enter device name"
              />
              {errors.deviceName && (
                <p className="mt-1 text-sm text-red-600">{errors.deviceName.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="spinner mr-2"></div>
                  Assessing Risk...
                </div>
              ) : (
                'Check Risk Level'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Risk Checks */}
      {recentChecks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Risk Checks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manufacturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentChecks.map((check) => (
                  <tr key={check.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {check.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {check.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {check.device}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(check.riskClass)}`}>
                        {check.riskClass}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {check.riskPercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-brand-blue mb-3">How Risk Assessment Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Data Analysis</h4>
            <p>Our system analyzes historical failure reports, manufacturer data, and device performance metrics.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Risk Classification</h4>
            <p>Devices are classified as Low, Medium, or High risk based on comprehensive analysis.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <p>Get alternative device suggestions and detailed risk breakdowns to make informed decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceRiskChecker;