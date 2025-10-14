'use client';

import { User, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface Concert {
  id: number | string;
  name: string;
  description: string;
  totalSeats: number;
}

interface ConcertBuyItemProps {
  concert: Concert;
}

export default function ConcertBuyItem({ concert }: ConcertBuyItemProps) {

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
            <span>{concert.totalSeats.toLocaleString()}</span>
          </div>
          <button 
          className="flex items-center px-4 py-2 text-sm text-white bg-green-500 rounded-md 
                      hover:bg-green-600 transition duration-150 shadow-md"
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}