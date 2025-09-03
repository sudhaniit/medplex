import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { riskAPI } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const RiskAssessmentResult = () => {
  const [result, setResult] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    // Get result from session storage
    const storedResult = sessionStorage.getItem('riskAssessmentResult');
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch (error) {
        console.error('Error parsing result:', error);
        navigate('/device-risk-checker');
      }
    } else {
      navigate('/device-risk-checker');
    }
  }, [navigate]);

  const getRiskColor = (riskClass) => {
    switch (riskClass) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskBorderColor = (riskClass) => {
    switch (riskClass) {
      case 'High': return 'border-red-200';
      case 'Medium': return 'border-yellow-200';
      case 'Low': return 'border-green-200';
      default: return 'border-gray-200';
    }
  };

  const onSubmitFeedback = async (data) => {
    if (!result) return;

    setFeedbackLoading(true);
    try {
      await riskAPI.submitFeedback({
        deviceId: result.device.id,
        feedbackText: data.feedbackText,
        rating: parseInt(data.rating),
        category: data.category || 'General'
      });

      toast.success('Feedback submitted successfully!');
      setShowFeedbackForm(false);
      reset();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit feedback';
      toast.error(message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-2 text-brand-blue">Loading results...</span>
      </div>
    );
  }

  // Prepare chart data
  const probabilityData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [result.probabilities.Low, result.probabilities.Medium, result.probabilities.High],
        backgroundColor: ['#22C55E', '#FBBF24', '#EF4444'],
        borderColor: ['#16A34A', '#F59E0B', '#DC2626'],
        borderWidth: 2,
      },
    ],
  };

  const riskBreakdownData = {
    labels: Object.keys(result.riskBreakdown),
    datasets: [
      {
        label: 'Number of Issues',
        data: Object.values(result.riskBreakdown).map(item => item.count),
        backgroundColor: '#1D4ED8',
        borderColor: '#1E40AF',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/device-risk-checker')}
          className="mb-4 text-brand-blue hover:text-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Risk Checker
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Assessment Results</h1>
        <p className="text-lg text-gray-600">
          Detailed analysis for {result.device.name} by {result.device.manufacturerName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-8">
          {/* Risk Overview */}
          <div className={`bg-white rounded-lg shadow-sm border-2 ${getRiskBorderColor(result.device.riskClass)} p-6`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Risk Assessment</h2>
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getRiskColor(result.device.riskClass)} mb-4`}>
                <div className="text-center">
                  <div className="text-3xl font-bold">{result.device.riskClass}</div>
                  <div className="text-sm opacity-90">Risk</div>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {result.device.riskPercentage}%
              </div>
              <p className="text-gray-600">Risk Probability</p>
            </div>
          </div>

          {/* Risk Probability Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Probability Breakdown</h3>
            <div className="w-full max-w-md mx-auto">
              <Pie 
                data={probabilityData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.label + ': ' + context.parsed + '%';
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>

          {/* Risk Breakdown Chart */}
          {Object.keys(result.riskBreakdown).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Factors</h3>
              <Bar 
                data={riskBreakdownData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          )}

          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Provide Feedback</h3>
              <button
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="btn-primary"
              >
                {showFeedbackForm ? 'Cancel' : 'Add Feedback'}
              </button>
            </div>

            {showFeedbackForm && (
              <form onSubmit={handleSubmit(onSubmitFeedback)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    {...register('rating', { required: 'Rating is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="">Select rating</option>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Very Poor</option>
                  </select>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="General">General</option>
                    <option value="Usability">Usability</option>
                    <option value="Reliability">Reliability</option>
                    <option value="Safety">Safety</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                  </label>
                  <textarea
                    {...register('feedbackText', {
                      required: 'Feedback is required',
                      minLength: {
                        value: 5,
                        message: 'Feedback must be at least 5 characters'
                      }
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Share your experience with this device assessment..."
                  />
                  {errors.feedbackText && (
                    <p className="mt-1 text-sm text-red-600">{errors.feedbackText.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={feedbackLoading}
                  className="btn-primary"
                >
                  {feedbackLoading ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Device Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Device Name</p>
                <p className="text-gray-900">{result.device.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Manufacturer</p>
                <p className="text-gray-900">{result.device.manufacturerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Risk Factors</p>
                <p className="text-gray-900">{result.device.totalRisks}</p>
              </div>
            </div>
          </div>

          {/* Alternative Devices */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Devices</h3>
              <div className="space-y-3">
                {result.alternatives.slice(0, 3).map((alt, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{alt.name}</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(alt.riskClass).replace('bg-', 'bg-').replace('text-white', 'text-white')}`}>
                        {alt.riskClass}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{alt.manufacturerName}</p>
                    <p className="text-sm text-gray-500">{alt.riskPercentage}% risk</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Devices */}
          {result.similarDevices && result.similarDevices.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Devices</h3>
              <div className="space-y-3">
                {result.similarDevices.map((sim, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{sim.name}</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(sim.riskClass).replace('bg-', 'bg-').replace('text-white', 'text-white')}`}>
                        {sim.riskClass}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{sim.riskPercentage}% risk</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/device-risk-checker')}
                className="w-full btn-primary"
              >
                Check Another Device
              </button>
              <button
                onClick={() => window.print()}
                className="w-full btn-secondary"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentResult;