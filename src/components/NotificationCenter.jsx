import React, { useEffect, useState } from 'react';
import { BellIcon, MailIcon } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { format } from 'date-fns';

const NotificationCenter = ({ userEmail }) => {
  const {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    refreshNotifications,
    isLoading
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications on mount and when userEmail changes
  useEffect(() => {
    if (userEmail) {
      const loadNotifications = async () => {
        await refreshNotifications(userEmail);
        setNotifications(getUserNotifications(userEmail));
        setUnreadCount(getUnreadCount(userEmail));
      };
      loadNotifications();
      // Refresh every 30 seconds
      const intervalId = setInterval(loadNotifications, 30000);
      return () => clearInterval(intervalId);
    }
  }, [userEmail, refreshNotifications, getUserNotifications, getUnreadCount]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
      setNotifications(
        notifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="relative">
      <button
        className="relative p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={toggleNotifications}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>

          {/* Notification panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-30">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-1 text-sm text-gray-500">Loading notifications...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <MailIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.subject}</p>
                        <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTimestamp(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;