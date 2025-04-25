import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Shared/Button';

const LeadFormSuccess = ({ userData, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto text-center py-8"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-green-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bedankt voor je aanmelding!</h2>
        
        <p className="text-gray-600 mb-6">
          Hallo {userData.first_name}, we hebben je aanmelding als {userData.role} ontvangen. 
          Je ontvangt binnenkort een bevestigingsmail op {userData.email}.
        </p>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-sm text-gray-500 mb-4">
            Heb je vragen? Neem contact met ons op via{' '}
            <a href="mailto:investbotiq@gmail.com" className="text-blue-600 hover:underline">
              investbotiq@gmail.com
            </a>
          </p>
          
          <Button 
            onClick={onReset}
            variant="outline"
          >
            Terug naar startpagina
          </Button>
        </div>
      </div>
      
      {/* Social sharing options */}
      <div className="mt-8">
        <p className="text-sm text-gray-600 mb-4">Deel InvestbotIQ met anderen:</p>
        <div className="flex justify-center space-x-4">
          <a 
            href={`https://twitter.com/intent/tweet?text=Ik heb me zojuist aangemeld bij InvestbotIQ!&url=https://investbotiq.com`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=https://investbotiq.com`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=https://investbotiq.com`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-800 hover:text-blue-900"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadFormSuccess;
