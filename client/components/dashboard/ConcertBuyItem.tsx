'use client';

import { User } from 'lucide-react';
import React, { useState } from 'react';

interface Concert {
  id: number | string;
  name: string;
  description: string;
  totalSeats: number;
  reservedCount: number;
  latestAction: 'RESERVE' | 'CANCEL' | null; 
}

interface ConcertBuyItemProps {
  concert: Concert;
  onReserve: (concertId: number | string) => Promise<void>;
  onCancel: (concertId: number | string) => Promise<void>;
}

export default function ConcertBuyItem({ 
  concert, 
  onReserve, 
  onCancel }: ConcertBuyItemProps) {
  const [currentStatus, setCurrentStatus] = useState(concert.latestAction); 
  const [isLoading, setIsLoading] = useState(false);

  const isReserveDisabled = currentStatus === 'RESERVE' || isLoading;

  let isCancelDisabledLogic: boolean;
  if (currentStatus === 'RESERVE') {
      isCancelDisabledLogic = false;
  } else if (currentStatus === 'CANCEL') {
      isCancelDisabledLogic = true;
  } else if (currentStatus === null) {
      isCancelDisabledLogic = false;
  }

  const availableSeats = Math.max(0, concert.totalSeats - (concert.reservedCount ?? 0));

  const isCancelDisabledFinal = isCancelDisabledLogic || isLoading;

  const handleReserve = async () => {
    setIsLoading(true);
    try {
      await onReserve(concert.id);
      setCurrentStatus('RESERVE');
    } catch (error) {
      console.error("Reservation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await onCancel(concert.id);
      setCurrentStatus('CANCEL');
    } catch (error) {
      console.error("Cancellation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="py-6 border-b border-gray-200 last:border-b-0">
        <h3 className="text-3xl font-semibold text-blue-600 border-b-1 border-gray-300 pb-4 mb-4">
            {concert.name}
        </h3>
        <p className="mt-2 text-gray-700 leading-relaxed">
          {concert.description}
        </p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-gray-500 text-sm">
            <User className="w-4 h-4 mr-2" />
            <span>{availableSeats.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
            onClick={handleReserve}
            disabled={isReserveDisabled}
            className={`flex items-center px-4 py-2 text-sm text-white rounded-md 
                       transition duration-150 shadow-md 
                       ${isReserveDisabled  ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isLoading && isReserveDisabled ? 'Processing...' : 'Reserve'}
            </button>
            <button 
            onClick={handleCancel}
            disabled={isCancelDisabledFinal} 
            className={`flex items-center px-4 py-2 text-sm text-white rounded-md 
                       transition duration-150 shadow-md 
                       ${isCancelDisabledFinal ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isLoading && isCancelDisabledFinal ? 'Processing...' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}