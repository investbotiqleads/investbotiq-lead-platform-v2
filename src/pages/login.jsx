import React from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="InvestbotIQ Logo" 
              className="h-10 w-auto mr-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/40x40?text=IQ';
              }}
            />
            <h1 className="text-xl font-bold text-blue-600">InvestbotIQ</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Login form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mt-16"
      >
        <LoginForm />
      </motion.div>
    </div>
  );
};

export default LoginPage;
