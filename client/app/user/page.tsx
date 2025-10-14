'use client';

import ConcertBuyItem from '@/components/dashboard/ConcertBuyItem';
import React, { useState, useEffect } from 'react';

const NEST_JS_API_URL = 'http://localhost:3001/concerts';

interface Concert {
  id: string;
  name: string;
  totalSeats: number;
  description: string | null;
  createdAt: string;
}

export default function AdminHomePage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConcerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch(NEST_JS_API_URL, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
        }

        const result = await response.json();
        setConcerts(result.data); 
        
    } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to connect to the server. Check network status.'); 
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  return (
    <div>
      <div className="mt-4">
        <div>
          {isLoading && (
            <div className="p-6 text-center">Loading concerts...</div>
          )}
          {error && (
            <div className="p-6 text-center text-red-600">Error: {error}</div>
          )}
          {concerts.length == 0 && !isLoading && (
            <div className="p-6 text-center text-gray-500">No concerts found.</div>
          )}
          {concerts.map((concert: any) => (
            <ConcertBuyItem key={concert.id} concert={concert} />
          ))}
        </div>
      </div>
    </div>
  );
}