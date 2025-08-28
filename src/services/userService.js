// userService.js
import { api, isDevelopment } from './api';

let mockUsers = [
  { id: 'emp1', name: 'John Doe', role: 'employee', email: 'john@example.com' },
  { id: 'sup1', name: 'Sarah Manager', role: 'supervisor', email: 'sarah@example.com' }
];

export const getAllUsers = async () => {
  try {
    const res = await api.get('/users');

    // Asegurarnos de devolver siempre un array
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (Array.isArray(res.data.users)) {
      return res.data.users;
    } else {
      return [];
    }
  } catch (err) {
    if (isDevelopment) {
      console.warn("⚠️ Using mock users:", err.message);
      return mockUsers;
    }
    throw err;
  }
};
