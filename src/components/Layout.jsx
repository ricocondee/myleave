import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CalendarIcon,
  LogOutIcon,
  HomeIcon,
  PlusCircleIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  UsersIcon,
  UserPlusIcon,
  Settings,
  BarChartIcon
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Layout = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Make user available globally
  useEffect(() => {
    window.__USER__ = user;
    return () => {
      delete window.__USER__;
    };
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-blue-700 text-white'
      : 'text-blue-100 hover:bg-blue-700 hover:text-white';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-blue-800 transition duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-blue-900">
          <div className="flex items-center">
            <CalendarIcon className="w-8 h-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">Leave Manager</span>
          </div>
          <button
            className="p-1 text-blue-200 rounded-md lg:hidden hover:text-white focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center px-4 py-3 mb-2 bg-blue-900 rounded-lg">
              <UserIcon className="w-5 h-5 text-blue-200 flex-shrink-0" />
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-blue-200 capitalize truncate">{user.role}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-md ${isActive('/')}`}
              onClick={() => setSidebarOpen(false)}
            >
              <HomeIcon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/new-request"
              className={`flex items-center px-4 py-2 rounded-md ${isActive('/new-request')}`}
              onClick={() => setSidebarOpen(false)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>New Request</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center px-4 py-2 rounded-md ${isActive('/profile')}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>My Profile</span>
            </Link>

            {/* Supervisor-only links */}
            {user.role === 'supervisor' && (
              <>
                <Link
                  to="/users"
                  className={`flex items-center px-4 py-2 rounded-md ${isActive('/users')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <UsersIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Manage Users</span>
                </Link>

                <Link
                  to="/register-user"
                  className={`flex items-center px-4 py-2 rounded-md ${isActive('/register-user')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <UserPlusIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Register User</span>
                </Link>

                <Link
                  to="/reports"
                  className={`flex items-center px-4 py-2 rounded-md ${isActive('/reports')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <BarChartIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Reports & Analytics</span>
                </Link>
              </>
            )}

            <button
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
              className="flex items-center w-full px-4 py-2 mt-6 text-blue-100 transition-colors rounded-md hover:bg-blue-700 hover:text-white"
            >
              <LogOutIcon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button
              className="p-1 mr-3 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold truncate">
              {location.pathname === '/' &&
                (user.role === 'supervisor' ? 'Supervisor Dashboard' : 'My Leave Requests')}
              {location.pathname === '/new-request' && 'New Leave Request'}
              {location.pathname.startsWith('/request/') && 'Leave Request Details'}
              {location.pathname === '/users' && 'Users Management'}
              {location.pathname === '/register-user' && 'Register New User'}
              {location.pathname === '/profile' && 'My Profile'}
              {location.pathname === '/reports' && 'Reports & Analytics'}
            </h1>
          </div>

          <div className="flex items-center">
            {user.role === 'supervisor' && <NotificationCenter userEmail={user.email} />}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;