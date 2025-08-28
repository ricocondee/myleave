import { useEffect, useState } from 'react';
import { getPendingLeaveRequests } from '../services/leaveService';

const SupervisorDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPendingLeaveRequests();
        setLeaveRequests(Array.isArray(data) ? data : []); // asegura que siempre sea array
      } catch (err) {
        console.error('Failed to load leave requests:', err);
        setError('Failed to load leave requests.');
        setLeaveRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Pending Leave Requests</h1>
      {leaveRequests.length === 0 ? (
        <p>No pending leave requests.</p>
      ) : (
        <ul>
          {leaveRequests.map((req) => (
            <li key={req.id}>
              {req.employeeName} - {req.type} ({req.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupervisorDashboard;