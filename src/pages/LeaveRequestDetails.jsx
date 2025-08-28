import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeave } from '../context/LeaveContext';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { PrinterIcon, AlertCircleIcon } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import NotificationToast from '../components/NotificationToast';
import SignatureCanvas from '../components/SignatureCanvas';
import PrintableLeaveRequest from '../components/PrintableLeaveRequest';

const LeaveRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getLeaveRequestById,
    updateLeaveRequestStatus,
    addEmployeeSignature,
    isLoading,
    error: leaveError
  } = useLeave();
  const { getUserById, isLoading: userLoading, error: userError } = useUser();
  const { sendNotification } = useNotification();

  const [leaveRequest, setLeaveRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [employeeSignature, setEmployeeSignature] = useState('');
  const [supervisorSignature, setSupervisorSignature] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState(null);

  const printableContentRef = useRef(null);

  const currentUser = window.__USER__ || null;

  useEffect(() => {
    const fetchLeaveRequest = async () => {
      try {
        const request = getLeaveRequestById(id || '');
        if (request) {
          setLeaveRequest(request);
          setComment(request.supervisorComment || '');
          setEmployeeSignature(request.employeeSignature || '');
        }
      } catch (err) {
        console.error('Error fetching leave request:', err);
        setError('Failed to load leave request details');
      }
    };
    fetchLeaveRequest();
  }, [id, getLeaveRequestById]);

  if (isLoading || userLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading leave request details...</p>
      </div>
    );
  }

  if (error || leaveError || userError || !leaveRequest) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <AlertCircleIcon className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700">
          {error || leaveError || userError || 'Leave request not found'}
        </h2>
        <button onClick={() => navigate('/')} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const isEmployee = currentUser?.role === 'employee';
  const isSupervisor = currentUser?.role === 'supervisor';
  const isRequestCreator = currentUser?.id === leaveRequest.employeeId;

  const handleStatusUpdate = async (status) => {
    if (!supervisorSignature) {
      alert('Please provide your signature before approving/rejecting the request');
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const employee = await getUserById(leaveRequest.employeeId);
      await updateLeaveRequestStatus(leaveRequest.id, status, comment, {
        id: currentUser?.id || '',
        name: currentUser?.name || '',
        signature: supervisorSignature
      });
      if (employee) {
        await sendNotification(
          employee.email,
          `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
          `Your leave request from ${formatDate(leaveRequest.startDate)} to ${formatDate(leaveRequest.endDate)} has been ${status}${comment ? `. Comment: ${comment}` : '.'}`
        );
      }
      setShowNotification(true);
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error updating leave request:', err);
      setError('Failed to update leave request. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleEmployeeSignature = async (signature) => {
    try {
      setEmployeeSignature(signature);
      await addEmployeeSignature(leaveRequest.id, signature);
      setLeaveRequest({ ...leaveRequest, employeeSignature: signature });
    } catch (err) {
      console.error('Error adding signature:', err);
      setError('Failed to save signature. Please try again.');
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <>
      {showNotification && (
        <NotificationToast
          message={`Leave request ${leaveRequest.status === 'approved' ? 'approved' : 'rejected'} and employee notified`}
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}
      {error && <NotificationToast message={error} type="info" onClose={() => setError(null)} />}

      <div className={`max-w-3xl mx-auto ${isPrinting ? 'hidden' : ''}`}>
        {/* ... el resto del JSX permanece igual, incluyendo la sección de firmas y acciones */}
      </div>

      <div ref={printableContentRef} className={`${!isPrinting ? 'hidden' : ''}`}>
        <PrintableLeaveRequest leaveRequest={leaveRequest} />
      </div>
    </>
  );
};

export default LeaveRequestDetails;