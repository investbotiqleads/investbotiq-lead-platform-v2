import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Shared/Button';

const roleOptions = [
  {
    id: 'member',
    title: 'Member',
    description: 'Ik wil cashflow creëren',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'ouder',
    title: 'Ouder',
    description: 'Ik wil voor mijn kinderen, dat ze een streepje voor hebben',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Ik kan steun bij mijn studie goed gebruiken',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    )
  }
];

const LeadFormStep1 = ({ onSelectRole }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <p className="text-gray-600">Selecteer je rol om te beginnen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roleOptions.map((role) => (
          <motion.div
            key={role.id}
            whileHover={{ scale: 1.04, boxShadow: '0 4px 24px 0 rgba(99,102,241,0.14)' }}
            whileTap={{ scale: 0.97, boxShadow: '0 2px 8px 0 rgba(99,102,241,0.16)' }}
            className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg active:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            tabIndex={0}
            onClick={() => onSelectRole(role.id)}
            role="button"
            aria-pressed="false"
          >
            <div className="flex items-start space-x-4">
              <div className="text-blue-600">{role.icon}</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{role.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{role.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Door verder te gaan, ga je akkoord met onze <a href="#" className="text-blue-600 hover:underline">Algemene Voorwaarden</a> en <a href="#" className="text-blue-600 hover:underline">Privacybeleid</a>.</p>
      </div>
    </motion.div>
  );
};

export default LeadFormStep1;
