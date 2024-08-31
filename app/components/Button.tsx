import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  colorClasses?: string;
  hasOutline?: boolean;
}

export default function Button({ onClick, children, colorClasses, hasOutline }: ButtonProps) {
  const colors = colorClasses || "text-white bg-[#304d6d] dark:bg-[#4F6479] hover:bg-[#82A0BC]";
  const outline = hasOutline 
    ? "relative before:absolute before:top-1 before:right-1 before:bottom-1 before:left-1 before:border-2 before:border-white before:rounded-full before:pointer-events-none"
    : "";

  return (
    <button 
      className={`py-3 px-12 text-white font-medium rounded-full mb-4 ${colors} ${outline}`} 
      onClick={onClick} 
      style={{ transition: '0.3s' }}
    >
      <div className="flex flex-row justify-center gap-2 text-nowrap">
        {children}
      </div>
    </button>
  );
}
