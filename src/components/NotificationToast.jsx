import React, { useEffect, useState } from 'react';
import { CheckIcon, XIcon, BellIcon } from 'lucide-react';

const NotificationToast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Permitir tiempo para animación de fade-out
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 flex items-center p-4 mb-4 max-w-xs text-gray-500 bg-white rounded-lg shadow transition-opacity print:hidden ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } z-50`}
      role="alert"
    >
      <div
        className={`inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg ${
          type === 'success' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'
        }`}
      >
        {type === 'success' ? <CheckIcon className="w-5 h-5" /> : <BellIcon className="w-5 h-5" />}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NotificationToast;