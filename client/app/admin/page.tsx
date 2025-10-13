'use client';

import StatCard from '@/components/dashboard/StatCard';
import ConcertListItem from '@/components/dashboard/ConcertListItem';
import ConcertForm from '@/components/dashboard/ConcertForm';
import React, { useState, useEffect } from 'react';

const NEST_JS_API_URL = 'http://localhost:3001/concerts';

// async function getStats() {
//   const res = await fetch(`${NU_XT_API_URL}/api/admin/stats`, {
//     cache: 'no-store',
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch stats');
//   }
//   return res.json();
// }

async function getConcerts() {
  const res = await fetch(NEST_JS_API_URL, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
  });

  return res.json();
}
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
  // const [stats, concerts] = await Promise.all([getStats(), getConcerts()]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = {
    totalSeats: 1000,
    reserved: 350,
    cancelled: 25,
  };
  // const concerts = [
  //   { 
  //     id: 1, 
  //     name: 'Concert A', 
  //     description: 'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed donec commodo morbi diam scelerisque.', 
  //     totalSeats: 290 
  //   },
  //   { 
  //     id: 2, 
  //     name: 'Concert B', 
  //     description: 'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. ', 
  //     totalSeats: 200 
  //   },
  // ];

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
        // NestJS API คืนค่าเป็น { count: number, data: Concert[] }
        setConcerts(result.data); 
        
    } catch (err) {
        console.error('Fetch Error:', err);
        // 💡 จัดการ Error: Cannot connect to the server. Please check your network connection.
        setError('ไม่สามารถเชื่อมต่อ Server ได้ โปรดตรวจสอบ Network'); 
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total of seats" value={stats.totalSeats} color="blue" logo="seats" />
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
                throw new Error('Function not implemented.');
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