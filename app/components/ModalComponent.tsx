
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

type ModalComponentProps = {
    children: React.ReactNode;
    show: boolean;
    onClose: () => void;
}

const DELAY_MS = 800;

export const ModalComponent = ({ children, show, onClose}: ModalComponentProps) => {
    const [showComponent, setShowComponent] = useState(false);
  
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, DELAY_MS);
        return () => clearTimeout(timeoutId);
    }, []); 

    if (!show) {
        return null;
    }
    
    return (
        showComponent &&
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-center'>
            <div className={`bg-white rounded-lg ${showComponent ? 'animate-fade' : ''}`}>
                <XMarkIcon className="h-6 w-6 ml-auto mr-6 mt-6 text-dark-maroon" onClick={() => onClose()} />
                {children}
            </div>
        </div>
    );
}