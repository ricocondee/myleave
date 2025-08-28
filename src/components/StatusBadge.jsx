import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : 'unknown';

  const getStatusStyles = () => {
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const displayText = () => {
    switch (normalizedStatus) {
      case 'pending':
      case 'approved':
      case 'rejected':
        return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
      default:
        return 'Unknown';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {displayText()}
    </span>
  );
};

export default StatusBadge;