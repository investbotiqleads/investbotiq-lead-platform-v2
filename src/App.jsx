import React from 'react';
import { useAnalytics } from './lib/useAnalytics';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import pages
import HomePage from './pages/index';
import AdminPage from './pages/admin';
import LoginPage from './pages/login';
import BlogList from './pages/blog/index';
import BlogDetail from './pages/blog/[id]';
import BlogEditor from './pages/admin/BlogEditor';

// Import components
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  useAnalytics();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blog" 
            element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blog/:id" 
            element={
              <ProtectedRoute>
                <BlogEditor />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
