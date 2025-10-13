import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function SuccessToast({ message, isVisible, onClose }: SuccessToastProps) {
    if (!isVisible) return null;

    return (
        <div 
            className="fixed top-5 right-5 z-50 p-4 rounded-lg shadow-xl"
            style={{ backgroundColor: '#D1FAE5' }}
        >
            <div className="flex items-center justify-between space-x-4">
                <CheckCircle className="w-5 h-5 text-green-600" /> 
                
                <span className="text-sm font-medium text-green-800">
                    {message}
                </span>
                
                <button onClick={onClose} className="p-1 rounded-full text-green-600 hover:bg-green-200">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}