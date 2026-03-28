import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarRootProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  badge?: React.ReactNode;
  href?: string;
  className?: string;
}

const Sidebar = ({ isOpen, onClose, children, className }: SidebarRootProps) => {
  return (
    <>
      <div 
        className={twMerge(
          "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside 
        className={twMerge(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:inset-auto",
          className
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white flex flex-col">
           {children}
        </div>
      </aside>
    </>
  );
};

const SidebarHeader = ({ children, onClose, className }: { children: React.ReactNode, onClose?: () => void, className?: string }) => {
  return (
    <div className={twMerge("mb-5 flex items-center justify-between ps-2.5", className)}>
      {children}
      
      {onClose && (
        <button 
          onClick={onClose}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 md:hidden inline-flex justify-center items-center"
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
          <span className="sr-only">Close menu</span>
        </button>
      )}
    </div>
  );
};

const SidebarContent = ({ children, className }: BaseProps) => {
  return (
    <ul className={twMerge("space-y-2 font-medium flex-1", className)}>
      {children}
    </ul>
  );
};

const SidebarItem = ({ icon, text, active = false, badge, href = "#", className }: SidebarItemProps) => (
  <li>
    <a 
      href={href} 
      className={twMerge(
        "flex items-center p-2 text-gray-900 rounded-lg group hover:bg-gray-100 transition-colors",
        active && "bg-gray-100",
        className
      )}
    >
      <span className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900">
        {icon}
      </span>
      <span className="flex-1 ms-3 whitespace-nowrap">{text}</span>
      {badge && badge}
    </a>
  </li>
);

const SidebarDropdown = ({ icon, text, children }: { icon: React.ReactNode, text: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
      >
        <span className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900">
          {icon}
        </span>
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{text}</span>
        <svg className={twMerge("w-3 h-3 transition-transform", isOpen ? "rotate-180" : "")} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
      </button>
      <ul className={twMerge("py-2 space-y-2", isOpen ? "block" : "hidden")}>
        {children}
      </ul>
    </li>
  );
};

const SidebarSubItem = ({ text, href = "#" }: { text: string, href?: string }) => (
  <li>
    <a href={href} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100">
      {text}
    </a>
  </li>
);

Sidebar.Header = SidebarHeader;
Sidebar.Content = SidebarContent;
Sidebar.Item = SidebarItem;
Sidebar.Dropdown = SidebarDropdown;
Sidebar.SubItem = SidebarSubItem;

export default Sidebar;