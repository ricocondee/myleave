import React, { useEffect, useState, createContext, useContext } from 'react';
import * as userService from '../services/userService';

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const newUser = await userService.registerUser(userData);
      setUsers([...users, newUser]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserById = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await userService.getUserById(id);
      return user;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch user');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      return await userService.getAllUsers();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch users');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (userId, currentPassword, newPassword) => {
    try {
      setIsLoading(true);
      setError(null);
      return await userService.changePassword(userId, currentPassword, newPassword);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateUser = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user, token } = await userService.login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      users,
      isLoading,
      error,
      addUser,
      getUserById,
      getAllUsers,
      changePassword,
      authenticateUser,
      refreshUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};