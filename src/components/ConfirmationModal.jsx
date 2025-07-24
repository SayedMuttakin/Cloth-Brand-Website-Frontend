
import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md p-4 mx-2 sm:p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="text-gray-400 bg-transparent rounded-lg hover:bg-gray-700 hover:text-white p-1.5"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="p-3 mb-4 bg-red-500 bg-opacity-10 rounded-full">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-white" id="modal-title">
            {title}
          </h3>
          
          <p className="mb-6 text-sm text-gray-300">
            {message}
          </p>

          <div className="flex justify-center gap-4 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-600"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-900"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
