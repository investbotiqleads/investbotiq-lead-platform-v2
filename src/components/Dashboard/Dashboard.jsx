import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabaseAuth, useSupabaseDb } from '../../hooks/useSupabaseClient';
import { useUserRole } from '../../hooks/useUserRole';
import { exportLeadsToSheets } from '../../lib/sheetsWebhook';
import LeadsTable from './LeadsTable';
import LeadDetailsModal from './LeadDetailsModal';
import { Button } from '../Shared/Button';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useSupabaseAuth();
  const { getAllLeads } = useSupabaseDb();
  const { role, error: roleError, loading: roleLoading } = useUserRole();

  // Fetch leads on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const data = await getAllLeads();
        setLeads(data || []);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setError('Er is een fout opgetreden bij het ophalen van de leads.');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch leads if user is authenticated and is admin
    if (user && role === 'admin' && !authLoading && !roleLoading) {
      fetchLeads();
    } else if (!authLoading && !roleLoading && (!user || role !== 'admin')) {
      // Redirect to home if not authenticated or not admin
      navigate('/');
    }
  }, [user, role, authLoading, roleLoading, getAllLeads, navigate]);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Er is een fout opgetreden bij het uitloggen.');
    }
  };
  
  // Handle view lead details
  const handleViewLeadDetails = (lead) => {
    setSelectedLead(lead);
  };
  
  // Handle close lead details modal
  const handleCloseLeadDetails = () => {
    setSelectedLead(null);
  };
  
  // Handle export to Google Sheets
  const handleExportToSheets = async () => {
    try {
      setIsLoading(true);
      const result = await exportLeadsToSheets(leads);
      alert(`Succesvol geëxporteerd: ${result.count} leads naar Google Sheets`);
    } catch (error) {
      console.error('Error exporting to Google Sheets:', error);
      setError('Er is een fout opgetreden bij het exporteren naar Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading state
  if (authLoading || roleLoading || (isLoading && leads.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <span className="text-blue-600 text-lg font-semibold">Dashboard laden...</span>
      </div>
    );
  }

  // Show error if unable to get role
  if (roleError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Fout bij ophalen rol</h1>
        <p className="text-gray-600 mb-6">{roleError.message}</p>
        <Button onClick={() => navigate('/')}>Terug naar home</Button>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Toegang geweigerd</h1>
        <p className="text-gray-600 mb-6">Je hebt geen toegang tot het admin dashboard.</p>
        <Button onClick={() => navigate('/')}>Terug naar home</Button>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">InvestbotIQ Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Ingelogd als: {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Uitloggen
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Dashboard stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Totaal Leads</h2>
            <p className="text-3xl font-bold text-blue-600">{leads.length}</p>
          </div>
          
          {/* Role-based stats */}
          {['member', 'freelancer', 'parent', 'student', 'affiliated'].map(role => {
            const count = leads.filter(lead => lead.role === role).length;
            return (
              <div key={role} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  {role.charAt(0).toUpperCase() + role.slice(1)}s
                </h2>
                <p className="text-3xl font-bold text-blue-600">{count}</p>
              </div>
            );
          })}
        </div>
        
        {/* Leads table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Alle Leads</h2>
          <LeadsTable 
            leads={leads} 
            onViewDetails={handleViewLeadDetails}
            onExportToSheets={handleExportToSheets}
          />
        </div>
      </main>
      
      {/* Lead details modal */}
      {selectedLead && (
        <LeadDetailsModal 
          lead={selectedLead} 
          onClose={handleCloseLeadDetails} 
        />
      )}
    </motion.div>
  );
};

export default Dashboard;
