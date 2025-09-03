import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">
              Assess medical device risks for hospitals and improve manufacturing quality
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              A unified platform for medical users and manufacturers to evaluate device risk, 
              visualize insights, and reduce faults for safer healthcare.
            </p>
            
            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Benefits:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brand-green rounded-full mr-3"></span>
                  Comprehensive risk assessment for medical devices
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brand-green rounded-full mr-3"></span>
                  Real-time failure reporting and tracking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brand-green rounded-full mr-3"></span>
                  Data-driven insights for manufacturers
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-brand-green rounded-full mr-3"></span>
                  Continuous improvement through feedback loops
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="btn-primary text-lg px-6 py-3"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn-success text-lg px-6 py-3"
              >
                Register
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Platform Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="font-semibold text-brand-blue mb-2">Device Risk Checker</h4>
                <p className="text-sm text-gray-600">
                  Assess device risk probability by device and manufacturer with detailed analytics.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50">
                <h4 className="font-semibold text-brand-green mb-2">Manufacturer Insights</h4>
                <p className="text-sm text-gray-600">
                  Identify patterns and improve device quality through comprehensive data analysis.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-brand-yellow mb-2">Fault Reduction</h4>
                <p className="text-sm text-gray-600">
                  Use feedback loops to reduce high-risk outcomes and improve patient safety.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-600 mb-2">Real-time Monitoring</h4>
                <p className="text-sm text-gray-600">
                  Track device performance and receive alerts for potential issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Empowering Healthcare Through Data
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform bridges the gap between hospitals and manufacturers, 
              creating a safer healthcare environment through intelligent risk assessment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Risk Assessment</h3>
              <p className="text-gray-600">
                Advanced algorithms analyze device data to provide accurate risk classifications 
                and recommendations for safer healthcare practices.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Insights</h3>
              <p className="text-gray-600">
                Get instant feedback on device performance, failure patterns, and improvement 
                opportunities to make informed decisions quickly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Collaborative Platform</h3>
              <p className="text-gray-600">
                Foster collaboration between hospitals and manufacturers to continuously 
                improve device quality and patient outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-blue">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Improve Healthcare Safety?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hospitals and manufacturers worldwide in creating safer healthcare environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-brand-blue px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-blue transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;