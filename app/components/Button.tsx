import React from 'react';

type ButtonType = 'primary' | 'secondary';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  colorClasses?: string;
  buttonType?: ButtonType;
  styles?: string;
}

export default function Button({
  onClick,
  children,
  colorClasses,
  buttonType = 'primary',
  styles = '',
}: ButtonProps) {
  // Default color classes
  const defaultColors =
    'text-white bg-[#304d6d] dark:bg-[#4F6479] hover:bg-[#82A0BC]';

  // Inverted color classes using box-shadow instead of outline or border
  const invertedColors =
    'text-[#304d6d] bg-white dark:bg-white hover:bg-[#f0f0f0] shadow-[inset_0_0_0_2px_#304d6d] dark:shadow-none';

  // Determine which color classes to use based on the invert prop
  const colors =
    buttonType === 'secondary' ? invertedColors : colorClasses || defaultColors;

  return (
    <button
      className={`py-3 px-12 font-medium rounded-full mb-4 ${colors} ${styles}`}
      onClick={onClick}
      style={{ transition: '0.3s' }}
    >
      <div className="flex flex-row justify-center gap-2 text-nowrap">
        {children}
      </div>
    </button>
  );
}
