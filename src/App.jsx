import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LeaveProvider } from './context/LeaveContext';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import NewLeaveRequest from './pages/NewLeaveRequest';
import LeaveRequestDetails from './pages/LeaveRequestDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import UsersList from './pages/UsersList';
import ReportsAnalytics from './pages/ReportsAnalytics';
export function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Check for stored user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>;
  }
  return <Router>
      <UserProvider>
        <NotificationProvider>
          <LeaveProvider>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login setUser={setUser} />} />
                {user ? <Route element={<Layout user={user} setUser={handleLogout} />}>
                    <Route path="/" element={user.role === 'supervisor' ? <SupervisorDashboard /> : <Dashboard />} />
                    <Route path="/new-request" element={<NewLeaveRequest />} />
                    <Route path="/request/:id" element={<LeaveRequestDetails />} />
                    <Route path="/profile" element={<Profile user={user} />} />
                    {/* Supervisor-only routes */}
                    {user.role === 'supervisor' ? <>
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/register-user" element={<RegisterUser />} />
                        <Route path="/reports" element={<ReportsAnalytics />} />
                      </> : <>
                        <Route path="/users" element={<Navigate to="/" replace />} />
                        <Route path="/register-user" element={<Navigate to="/" replace />} />
                        <Route path="/reports" element={<Navigate to="/" replace />} />
                      </>}
                  </Route> : <Route path="*" element={<Navigate to="/login" replace />} />}
              </Routes>
            </div>
          </LeaveProvider>
        </NotificationProvider>
      </UserProvider>
    </Router>;
}