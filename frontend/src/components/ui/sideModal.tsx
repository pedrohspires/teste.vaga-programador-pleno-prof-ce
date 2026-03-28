import React, { forwardRef, useEffect, useId } from 'react';
import { twMerge } from 'tailwind-merge';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface SideModalRootProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideModalRoot = ({ isOpen, onClose, children, className }: SideModalRootProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={twMerge("relative z-50", isOpen ? "" : "pointer-events-none")}>
      <div
        className={twMerge(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={twMerge(
        "fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}>
        {children}
      </div>
    </div>
  );
};


const Header = ({ children, onClose, className }: { children: React.ReactNode, onClose?: () => void, className?: string }) => (
  <div className={twMerge("flex items-center justify-between px-6 py-4 border-b border-slate-100", className)}>
    <h2 className="text-lg font-bold text-slate-800">{children}</h2>
    {onClose && (
      <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    )}
  </div>
);

const Body = ({ children, className }: BaseProps) => (
  <div className={twMerge("flex-1 overflow-y-auto p-6 space-y-5 h-full", className)}>
    {children}
  </div>
);

const Footer = ({ children, className }: BaseProps) => (
  <div className={twMerge("border-t border-slate-100 p-6 bg-slate-50 flex justify-end gap-3", className)}>
    {children}
  </div>
);


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextField = forwardRef<HTMLInputElement, InputProps>(({ label, id, className, ...props }, ref) => {
  const uniqueId = useId();
  const inputId = id || uniqueId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        type="text"
        className={twMerge(
          "w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all",
          "disabled:bg-slate-100 disabled:text-slate-500",
          className
        )}
        {...props}
      />
    </div>
  );
});
TextField.displayName = "SideModal.TextField";

const CheckboxField = forwardRef<HTMLInputElement, InputProps>(({ label, id, className, ...props }, ref) => {
  const uniqueId = useId();
  const inputId = id || uniqueId;

  return (
    <div className={twMerge("flex items-start p-4 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors", className)}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
          {...props}
        />
      </div>
      <div className="ms-2 text-sm">
        <label htmlFor={inputId} className="font-medium text-slate-900 select-none cursor-pointer">
          {label}
        </label>
      </div>
    </div>
  );
});
CheckboxField.displayName = "SideModal.CheckboxField";



export const SideModal = Object.assign(SideModalRoot, {
  Header,
  Body,
  Footer,
  TextField,
  Checkbox: CheckboxField
});

export default SideModal;