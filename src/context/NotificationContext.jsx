import React, { useEffect, useState, createContext, useContext } from 'react';
import * as notificationService from '../services/notificationService';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const refreshNotifications = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await notificationService.getUserNotifications(email);
      setNotifications(data);

      const count = data.filter(n => !n.read).length;
      setUnreadCounts(prev => ({
        ...prev,
        [email]: count
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = async (recipient, subject, message) => {
    try {
      setIsLoading(true);
      setError(null);
      const newNotification = await notificationService.sendNotification(recipient, subject, message);
      setNotifications([...notifications, newNotification]);

      if (unreadCounts[recipient] !== undefined) {
        setUnreadCounts(prev => ({
          ...prev,
          [recipient]: prev[recipient] + 1
        }));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedNotification = await notificationService.markNotificationAsRead(id);

      setNotifications(notifications.map(n => n.id === id ? updatedNotification : n));

      if (updatedNotification && updatedNotification.read) {
        const recipient = updatedNotification.recipient;
        if (unreadCounts[recipient] !== undefined) {
          setUnreadCounts(prev => ({
            ...prev,
            [recipient]: Math.max(0, prev[recipient] - 1)
          }));
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to mark notification as read');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUnreadCount = (email) => unreadCounts[email] || 0;

  const getUserNotifications = (email) =>
    notifications.filter(n => n.recipient === email);

  return (
    <NotificationContext.Provider value={{
      notifications,
      isLoading,
      error,
      sendNotification,
      markAsRead,
      getUnreadCount,
      getUserNotifications,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
