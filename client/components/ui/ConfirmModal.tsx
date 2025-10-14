'use client';

import React, { useState } from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import SuccessToast from '@/components/ui/SuccessToast';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    concertName: string;
    isDanger: boolean;
    confirmText: string;
}

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    concertName,
    isDanger, 
    confirmText 
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const [toast, setToast] = useState<{ isVisible: boolean, message: string }>({ 
        isVisible: false, 
        message: '' 
    });

    const closeToast = () => setToast({ isVisible: false, message: '' });

    const showSuccessToast = (message: string) => {
        setToast({ isVisible: true, message });
        setTimeout(closeToast, 3000); 
    };

    const confirmHandler = () => {
        onConfirm();
        onClose();
        showSuccessToast('Delete successfully');
    };

    const confirmButtonClasses = isDanger 
        ? "bg-red-600 hover:bg-red-700 text-white" 
        : "bg-blue-600 hover:bg-blue-700 text-white";

    return (
        <div className="fixed inset-0 bg-black/75 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full mx-4 p-6 transform transition-all">
                <div className="flex justify-center items-center space-x-3 mb-4">
                    {isDanger ? (
                        <XCircle className="w-10 h-10 text-red-600" />
                    ) : (
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    )}
                </div>
                
                <p className="text-gray-600 mb-6 text-center font-bold">{message}</p>
                <p className="text-gray-600 mb-6 text-center font-bold">{concertName}</p>

                <div className="flex justify-center space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmHandler}
                        className={`px-4 py-2 rounded-lg font-semibold ${confirmButtonClasses}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
            <SuccessToast
                isVisible={toast.isVisible}
                message={toast.message}
                onClose={closeToast}
            />
        </div>
    );
}