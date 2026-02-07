import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import LeaveRequests from './pages/LeaveRequests';
import AuditLog from './pages/AuditLog';
import Users from './pages/Users';
import Employees from './pages/Employees';

// CRM Pages (To be created)
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Opportunities from './pages/Opportunities';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px'
            }
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute permission="dashboard.read">
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/inventory" element={
            <ProtectedRoute permission="inv.products.read">
              <Layout><Inventory /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/hr/leave" element={
            <ProtectedRoute permission="hr.leave.read">
              <Layout><LeaveRequests /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/hr/employees" element={
            <ProtectedRoute permission="hr.employees.read">
              <Layout><Employees /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/audit-log" element={
            <ProtectedRoute permission="audit.read">
              <Layout><AuditLog /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute permission="users.read">
              <Layout><Users /></Layout>
            </ProtectedRoute>
          } />

          {/* CRM Routes */}
          <Route path="/crm/customers" element={
            <ProtectedRoute permission="crm.customers.read">
              <Layout><Customers /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/crm/leads" element={
            <ProtectedRoute permission="crm.leads.read">
              <Layout><Leads /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/crm/opportunities" element={
            <ProtectedRoute permission="crm.opportunities.read">
              <Layout><Opportunities /></Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
