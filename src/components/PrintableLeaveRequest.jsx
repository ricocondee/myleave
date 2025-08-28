import React from 'react';

const PrintableLeaveRequest = ({ leaveRequest }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="print-only p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Leave Request</h1>
        <p className="text-gray-500">Request #{leaveRequest.id}</p>
        <p className="text-gray-500">
          Generated on {new Date().toLocaleString()}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Request Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Employee</p>
            <p className="font-medium">{leaveRequest.employeeName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium capitalize">{leaveRequest.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Leave Type</p>
            <p className="font-medium capitalize">{leaveRequest.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date Requested</p>
            <p className="font-medium">{formatDateTime(leaveRequest.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">{formatDate(leaveRequest.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">{formatDate(leaveRequest.endDate)}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 border-b pb-2">Reason</h2>
        <p>{leaveRequest.reason}</p>
      </div>

      {leaveRequest.status !== 'pending' && leaveRequest.supervisorComment && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 border-b pb-2">
            Supervisor Comments
          </h2>
          <p>{leaveRequest.supervisorComment}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Signatures</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-500 mb-2">Employee Signature</p>
            {leaveRequest.employeeSignature ? (
              <img
                src={leaveRequest.employeeSignature}
                alt="Employee Signature"
                className="border border-gray-300 h-24 w-full object-contain bg-gray-50"
              />
            ) : (
              <div className="border border-gray-300 h-24 w-full flex items-center justify-center bg-gray-50 text-gray-400">
                No signature provided
              </div>
            )}
            <p className="mt-2 text-sm font-medium">{leaveRequest.employeeName}</p>
            <p className="text-xs text-gray-500">
              Date: {formatDate(leaveRequest.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Supervisor Signature</p>
            {leaveRequest.supervisorSignature ? (
              <img
                src={leaveRequest.supervisorSignature}
                alt="Supervisor Signature"
                className="border border-gray-300 h-24 w-full object-contain bg-gray-50"
              />
            ) : (
              <div className="border border-gray-300 h-24 w-full flex items-center justify-center bg-gray-50 text-gray-400">
                {leaveRequest.status !== 'pending'
                  ? 'No signature provided'
                  : 'Pending approval'}
              </div>
            )}
            <p className="mt-2 text-sm font-medium">
              {leaveRequest.supervisorName || 'Pending'}
            </p>
            {leaveRequest.status !== 'pending' && (
              <p className="text-xs text-gray-500">
                Date: {formatDate(leaveRequest.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-12 pt-4 border-t">
        <p>This document is electronically generated and contains electronic signatures.</p>
        <p>Last updated: {formatDateTime(leaveRequest.updatedAt)}</p>
      </div>
    </div>
  );
};

export default PrintableLeaveRequest;