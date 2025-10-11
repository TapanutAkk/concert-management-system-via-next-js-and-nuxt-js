'use client';

import { User, Trash2 } from 'lucide-react';
import React from 'react';

interface Concert {
  id: number | string;
  name: string;
  description: string;
  totalSeats: number;
}

interface ConcertListItemProps {
  concert: Concert;
  onDelete: (concertId: number | string) => void;
}

export default function ConcertListItem({ concert, onDelete }: ConcertListItemProps) {
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${concert.name}?`)) {
      onDelete(concert.id);
    }
  };

    return (
        <div className="py-6 border-b border-gray-200 last:border-b-0">
          <h3 className="text-3xl font-semibold text-blue-600 border-b-1 border-gray-300">
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
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-sm text-white bg-red-500 rounded-md 
                          hover:bg-red-600 transition duration-150 shadow-md"
              >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
              </button>
          </div>
        </div>
    );
}