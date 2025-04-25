import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Shared/Button';

const LeadDetailsModal = ({ lead, onClose }) => {
  if (!lead) return null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Niet opgegeven';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get role-specific data from extra_data field
  const extraData = lead.extra_data || {};

  // Helper function to format keys for display
  const formatKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-900">
              Lead Details: {lead.first_name} {lead.last_name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Basic information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basis Informatie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Naam</p>
                  <p className="mt-1 text-sm text-gray-900">{lead.first_name} {lead.last_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <p className="mt-1 text-sm text-gray-900">{lead.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefoon</p>
                  <p className="mt-1 text-sm text-gray-900">{lead.phone || 'Niet opgegeven'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rol</p>
                  <p className="mt-1 text-sm">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {lead.role.charAt(0).toUpperCase() + lead.role.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Geboortedatum</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(lead.birth_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Woonplaats</p>
                  <p className="mt-1 text-sm text-gray-900">{lead.city || 'Niet opgegeven'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referral Code</p>
                  <p className="mt-1 text-sm text-gray-900">{lead.referral_code || 'Geen'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Aangemeld op</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(lead.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Role-specific information */}
            {Object.keys(extraData).length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {lead.role.charAt(0).toUpperCase() + lead.role.slice(1)} Specifieke Informatie
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(extraData).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm font-medium text-gray-500">{formatKey(key)}</p>
                        <p className="mt-1 text-sm text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Sluiten
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LeadDetailsModal;
