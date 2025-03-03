import { XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

type ModalComponentProps = {
  delayMs: number;
  children: React.ReactNode;
  show: boolean;
  showChildren: boolean;
  onClose: () => void;
  width?: string;
};

export const ModalComponent = ({
  delayMs,
  children,
  show,
  showChildren,
  onClose,
  width,
}: ModalComponentProps) => {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowComponent(true);
    }, delayMs);
    return () => clearTimeout(timeoutId);
  }, [delayMs]);

  if (!show) {
    return null;
  }

  return (
    showComponent && (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6 ${width}`}
      >
        <div
          className={`max-h-full bg-white text-black-pearl dark:bg-dark-purple dark:text-white rounded-lg ${showComponent ? 'animate-fade' : ''} overflow-scroll`}
        >
          <XMarkIcon
            className="h-6 w-6 ml-auto mr-6 mt-6 text-black-pearl dark:text-white cursor-pointer"
            onClick={() => onClose()}
          />
          {showChildren ? children : null}
        </div>
      </div>
    )
  );
};
