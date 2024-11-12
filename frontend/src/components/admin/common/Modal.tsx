import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ModalHeaderProps {
  children: React.ReactNode;
}

interface ModalBodyProps {
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

interface ButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 px-6 py-4 rounded-t-lg border-b">
      <h3 className="text-lg font-medium">{children}</h3>
    </div>
  );
};

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 px-6 py-4 rounded-b-lg border-t flex justify-end space-x-2">
      {children}
    </div>
  );
};

const Button: React.FC<ButtonProps> = ({ onClick, variant = 'primary', children }) => {
  const variantStyles = {
    primary:
      'bg-blue-500 hover:bg-blue-600 text-white',
    secondary:
      'bg-gray-300 hover:bg-gray-400 text-gray-700',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded transition-colors ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
};

export { Modal, ModalHeader, ModalBody, ModalFooter, Button };