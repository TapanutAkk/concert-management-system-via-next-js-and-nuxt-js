'use client';

import StatCard from '@/components/dashboard/StatCard';
import ConcertListItem from '@/components/dashboard/ConcertListItem';
import ConcertForm from '@/components/dashboard/ConcertForm';
import React, { useState, useEffect } from 'react';

const NEST_JS_API_URL = 'http://localhost:3001/concerts';

async function sumTotalSeat() {
  const response = await fetch(`${NEST_JS_API_URL}/seats`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
  }

  const result = await response.json();
  return result.data;
}

const sumSeat = sumTotalSeat();

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
  // const [sumTotalSeat] = await Promise.all([sumTotalSeat()]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSeats, setTotalSeats] = useState<number | null>(null);

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
      setError('ไม่สามารถเชื่อมต่อเพื่อดึงผลรวมที่นั่งได้'); 
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalSeats: 1000,
    reserved: 350,
    cancelled: 25,
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
    fetchSeatSum();
  }, []);

  const deleteConcert = async (concertId) => {
    try {
        const response = await fetch(`${NEST_JS_API_URL}/${concertId}`, {
            method: 'DELETE',
        });
  
        if (response.status === 204) {
            fetchConcerts();
            fetchSeatSum();
        } else if (response.status === 404) {
             alert('Cannot delete: Concert not found.');
        } else {
             const errorResult = await response.json();
             alert(`Delete Failed: ${errorResult.message}`);
        }
  
    } catch (error) {
        console.error("Network Error:", error);
        alert('Failed to connect to the server. Check network status.');
    }
  }

  return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total of seats" value={totalSeats?.toLocaleString() || 0} color="blue" logo="seats" />
          <StatCard title="Reserve" value={stats.reserved} color="green"  logo="reserve" />
          <StatCard title="Cancel" value={stats.cancelled} color="red"  logo="cancel" />
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
            {concerts.length == 0 && (
              <div className="p-6 text-center text-gray-500">No concerts found.</div>
            )}
            {concerts.map((concert: any) => (
              <ConcertListItem key={concert.id} concert={concert} onDelete={function (concertId: string | number): void {
                deleteConcert(concertId);
              } } />
            ))}
          </div>
          }
          {activeTab === 'Create' && 
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <ConcertForm />
            </div>
          </div>
          }
        </div>
      </div>
    );
}