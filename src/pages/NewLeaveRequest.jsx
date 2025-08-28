import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeave } from '../context/LeaveContext';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import NotificationToast from '../components/NotificationToast';

const NewLeaveRequest = () => {
  const navigate = useNavigate();
  const { addLeaveRequest } = useLeave();
  const { users } = useUser();
  const { sendNotification } = useNotification();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('paid');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Find supervisors to notify
  const supervisors = users.filter(user => user.role === 'supervisor');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentUser = users.find((user) => user.id === 'emp1');
    if (!currentUser) {
      alert('User not found');
      setIsSubmitting(false);
      return;
    }

    try {
      // Crear la solicitud
      await addLeaveRequest({
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        startDate,
        endDate,
        type: leaveType,
        reason
      });

      // Enviar notificaciones
      await Promise.all(
        supervisors.map((supervisor) =>
          sendNotification(
            supervisor.email,
            'New Leave Request',
            `${currentUser.name} has submitted a new ${leaveType} leave request from ${startDate} to ${endDate}.`
          )
        )
      );

      // Mostrar notificación visual
      setShowNotification(true);

      // Navegar después de mostrar la notificación
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("There was an error submitting your request.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showNotification && (
        <NotificationToast
          message="Leave request submitted and supervisors notified"
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              New Leave Request
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Fill out the form below to submit a new leave request
            </p>
          </div>

          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start-date"
                    id="start-date"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end-date"
                    id="end-date"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700">
                    Leave Type
                  </label>
                  <select
                    id="leave-type"
                    name="leave-type"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value)}
                  >
                    <option value="paid">Paid Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Please provide a reason for your leave request..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewLeaveRequest;
