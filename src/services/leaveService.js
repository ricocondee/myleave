import {api, isDevelopment } from './api';

// Mock data for leave requests
let mockLeaveRequests = [
  {
    id: 'leave1',
    employeeId: 'emp1',
    employeeName: 'John Doe',
    startDate: '2023-06-01',
    endDate: '2023-06-05',
    type: 'paid',
    reason: 'Family vacation',
    status: 'approved',
    createdAt: '2023-05-20T10:30:00Z',
    updatedAt: '2023-05-22T14:45:00Z',
    supervisorComment: 'Approved. Enjoy your vacation!',
    supervisorId: 'sup1',
    supervisorName: 'Sarah Manager',
    supervisorSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwA...',
    employeeSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwA...'
  },
  {
    id: 'leave2',
    employeeId: 'emp1',
    employeeName: 'John Doe',
    startDate: '2023-07-10',
    endDate: '2023-07-12',
    type: 'unpaid',
    reason: 'Personal matters',
    status: 'pending',
    createdAt: '2023-07-01T08:20:00Z',
    updatedAt: '2023-07-01T08:20:00Z'
  }
];

// Helper para asegurar que siempre devolvemos array
const safeArray = (data) => (Array.isArray(data) ? data : []);

// Get all leave requests
export const getAllLeaveRequests = async () => {
  try {
    const response = await api.get('/leave-requests');
    return safeArray(response.data);
  } catch (error) {
    if (isDevelopment) {
      console.warn('Using mock data for getAllLeaveRequests', error);
      return safeArray(mockLeaveRequests);
    }
    return [];
  }
};

// Get leave requests for a specific user
export const getUserLeaveRequests = async (userId) => {
  try {
    const response = await api.get(`/leave-requests/user/${userId}`);
    return safeArray(response.data);
  } catch (error) {
    if (isDevelopment) {
      console.warn('Using mock data for getUserLeaveRequests', error);
      return safeArray(mockLeaveRequests.filter((req) => req.employeeId === userId));
    }
    return [];
  }
};

// Get pending leave requests
export const getPendingLeaveRequests = async () => {
  try {
    const response = await api.get('/leave-requests/pending');
    return safeArray(response.data);
  } catch (error) {
    if (isDevelopment) {
      console.warn('Using mock data for getPendingLeaveRequests', error);
      return safeArray(mockLeaveRequests.filter((req) => req.status === 'pending'));
    }
    return [];
  }
};

// Get a specific leave request by ID
export const getLeaveRequestById = async (id) => {
  try {
    const response = await api.get(`/leave-requests/${id}`);
    return response.data || null;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Using mock data for getLeaveRequestById', error);
      return mockLeaveRequests.find((req) => req.id === id) || null;
    }
    return null;
  }
};

// Create a new leave request
export const createLeaveRequest = async (request) => {
  try {
    const response = await api.post('/leave-requests', request);
    return response.data || null;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Using mock data for createLeaveRequest', error);
      const newRequest = {
        ...request,
        id: 'leave-' + Math.random().toString(36).substring(2),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockLeaveRequests.push(newRequest);
      return newRequest;
    }
    return null;
  }
};

// Update a leave request status
export const updateLeaveRequestStatus = async (id, status, comment, supervisorData) => {
  try {
    const response = await api.patch(`/leave-requests/${id}/status`, {
      status,
      comment,
      supervisorData
    });
    return response.data || null;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Using mock data for updateLeaveRequestStatus', error);
      const index = mockLeaveRequests.findIndex((req) => req.id === id);
      if (index >= 0) {
        mockLeaveRequests[index] = {
          ...mockLeaveRequests[index],
          status,
          updatedAt: new Date().toISOString(),
          supervisorComment: comment || mockLeaveRequests[index].supervisorComment,
          ...(supervisorData && {
            supervisorId: supervisorData.id,
            supervisorName: supervisorData.name,
            supervisorSignature: supervisorData.signature
          })
        };
        return mockLeaveRequests[index];
      }
    }
    return null;
  }
};

// Add employee signature to a leave request
export const addEmployeeSignature = async (id, signature) => {
  try {
    const response = await api.patch(`/leave-requests/${id}/signature`, { signature });
    return response.data || null;
  } catch (error) {
    if (isDevelopment) {
      console.warn('Using mock data for addEmployeeSignature', error);
      const index = mockLeaveRequests.findIndex((req) => req.id === id);
      if (index >= 0) {
        mockLeaveRequests[index] = {
          ...mockLeaveRequests[index],
          employeeSignature: signature,
          updatedAt: new Date().toISOString()
        };
        return mockLeaveRequests[index];
      }
    }
    return null;
  }
};
