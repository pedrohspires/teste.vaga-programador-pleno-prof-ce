import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalRootProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
}

interface ModalHeaderProps extends BaseProps {
  onClose?: () => void;
}

const Modal = ({ isOpen, onClose, children, maxWidth = 'max-w-md', className }: ModalRootProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900/60 backdrop-blur-sm p-4 md:p-0"
      onClick={handleBackdropClick}
    >
      <div ref={modalRef} className={twMerge("relative w-full my-auto transition-all", maxWidth, className)}>
        <div className="relative bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

const ModalHeader = ({ children, onClose, className }: ModalHeaderProps) => {
  return (
    <div className={twMerge("flex items-center justify-between border-b border-slate-100 p-4 md:p-5 shrink-0", className)}>
      <h3 className="text-lg font-bold text-slate-800">
        {children}
      </h3>
      {onClose && (
        <button 
          onClick={onClose} 
          type="button" 
          className="text-slate-400 bg-transparent hover:bg-slate-100 hover:text-slate-700 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors"
        >
          <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
        </button>
      )}
    </div>
  );
};

const ModalBody = ({ children, className }: BaseProps) => {
  return (
    <div className={twMerge("p-4 md:p-6 overflow-y-auto text-slate-600", className)}>
      {children}
    </div>
  );
};

const ModalFooter = ({ children, className }: BaseProps) => {
  return (
    <div className={twMerge("flex items-center justify-end space-x-3 border-t border-slate-100 p-4 md:p-6 shrink-0 bg-slate-50 rounded-b-xl", className)}>
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };