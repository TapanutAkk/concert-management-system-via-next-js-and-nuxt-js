'use client';

import StatCard from '@/components/dashboard/StatCard';
import ConcertListItem from '@/components/dashboard/ConcertListItem';
import ConcertForm from '@/components/dashboard/ConcertForm';
import React, { useState, useEffect } from 'react';
import SuccessToast from '@/components/ui/SuccessToast';

const NEST_JS_API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/concerts`;

const tabs = [
  { name: 'Overview', href: '#overview' },
  { name: 'Create', href: '#create' }
];

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
  const [totalSeats, setTotalSeats] = useState<number | null>(null);
  const [reservedSeats, setReservedSeats] = useState<number | null>(null);
  
  const [toast, setToast] = useState<{ isVisible: boolean, message: string }>({ 
    isVisible: false, 
    message: '' 
  });

  const closeToast = () => setToast({ isVisible: false, message: '' });

  const showSuccessToast = (message: string) => {
      setToast({ isVisible: true, message });
      setTimeout(closeToast, 3000); 
  };

  const fetchSeatSum = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${NEST_JS_API_URL}/seats`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch total seats data');
      }

      const result = await response.json();
      setTotalSeats(result.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to connect for data retrieval.'); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchReservedSeatSum = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${NEST_JS_API_URL}/reserved-seats`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch total seats data');
      }

      const result = await response.json();
      setReservedSeats(result.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to connect for data retrieval.'); 
    } finally {
      setIsLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState('Overview'); 

  const fetchConcerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch(NEST_JS_API_URL, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'Failed to fetch data');
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
    fetchSeatSum();
    fetchReservedSeatSum();
  }, []);

  interface ApiError {
    message?: string;
  }

  type ConcertId = string | number;

  const deleteConcert = async (concertId: ConcertId): Promise<void> => {
    try {
      const response = await fetch(`${NEST_JS_API_URL}/${concertId}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        fetchConcerts();
        fetchSeatSum();
        showSuccessToast('Delete successfully');
      } else if (response.status === 404) {
        alert('Cannot delete: Concert not found.');
      } else {
        const errorResult = (await response.json()) as ApiError;
        alert(`Delete Failed: ${errorResult.message ?? 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Failed to connect to the server. Check network status.');
    }
  };

  const canceledSeats = Math.max(0, (totalSeats ?? 0) - (reservedSeats ?? 0));

  return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total of seats" value={totalSeats ?? 0} color="blue" logo="seats" />
          <StatCard title="Reserve" value={reservedSeats ?? 0} color="green"  logo="reserve" />
          <StatCard title="Cancel" value={canceledSeats ?? 0} color="red"  logo="cancel" />
        </div>

        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.name);
                if(tab.name == 'Overview') {
                  fetchConcerts();
                  fetchSeatSum();
                }
              }}
              className={`
                ${tab.name === activeTab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
                whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium cursor-pointer
              `}
              aria-current={tab.name === activeTab ? 'page' : undefined}
            >
              {tab.name}
            </a>
          ))}
        </nav>

        <div className="mt-4">
          {activeTab === 'Overview' && 
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
            {concerts.map((concert: Concert) => {
              const normalizedConcert = { ...concert, description: concert.description ?? '' };
              return (
                <ConcertListItem key={concert.id} concert={normalizedConcert} onDelete={(concertId: string | number) => {
                  deleteConcert(concertId);
                }} />
              );
            })}
          </div>
          }
          {activeTab === 'Create' && 
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <ConcertForm onCreated={() => {
                showSuccessToast('Create successfully');
                setActiveTab('Overview');
                fetchConcerts();
                fetchSeatSum();
              }} />
            </div>
          </div>
          }
        </div>
        <SuccessToast
          isVisible={toast.isVisible}
          message={toast.message}
          onClose={closeToast}
        />
      </div>
    );
}