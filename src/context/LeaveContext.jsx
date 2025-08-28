import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  getAllLeaveRequests,
  createLeaveRequest as createLeaveRequestService,
  updateLeaveRequestStatus as updateLeaveRequestStatusService,
  addEmployeeSignature as addEmployeeSignatureService
} from '../services/leaveService';

const LeaveContext = createContext(undefined);

export const LeaveProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    refreshLeaveRequests();
  }, []);

  const refreshLeaveRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const requests = await getAllLeaveRequests();
      setLeaveRequests(requests);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('Failed to fetch leave requests. Please try again later.');
      setLeaveRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLeaveRequests = (userId) => leaveRequests.filter(r => r.employeeId === userId);

  const getPendingLeaveRequests = () => leaveRequests.filter(r => r.status === 'pending');

  const getLeaveRequestById = (id) => leaveRequests.find(r => r.id === id);

  const addLeaveRequest = async (request) => {
    try {
      setIsLoading(true);
      setError(null);
      const newRequest = await createLeaveRequestService(request);
      setLeaveRequests(prev => [...prev, newRequest]);
    } catch (err) {
      console.error('Error creating leave request:', err);
      setError('Failed to create leave request. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeaveRequestStatus = async (id, status, comment, supervisorData) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedRequest = await updateLeaveRequestStatusService(id, status, comment, supervisorData);
      setLeaveRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
    } catch (err) {
      console.error('Error updating leave request status:', err);
      setError('Failed to update leave request status. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addEmployeeSignature = async (id, signature) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedRequest = await addEmployeeSignatureService(id, signature);
      setLeaveRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
    } catch (err) {
      console.error('Error adding employee signature:', err);
      setError('Failed to add signature. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeaveContext.Provider value={{
      leaveRequests,
      getUserLeaveRequests,
      getPendingLeaveRequests,
      getLeaveRequestById,
      addLeaveRequest,
      updateLeaveRequestStatus,
      addEmployeeSignature,
      refreshLeaveRequests,
      isLoading,
      error
    }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) throw new Error('useLeave must be used within a LeaveProvider');
  return context;
};