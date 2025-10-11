'use client';

import StatCard from '@/components/dashboard/StatCard';
import ConcertListItem from '@/components/dashboard/ConcertListItem';
import ConcertForm from '@/components/dashboard/ConcertForm';
import React, { useState } from 'react';
// const NU_XT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; 

// async function getStats() {
//   const res = await fetch(`${NU_XT_API_URL}/api/admin/stats`, {
//     cache: 'no-store',
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch stats');
//   }
//   return res.json();
// }

// async function getConcerts() {
//   const res = await fetch(`${NU_XT_API_URL}/api/concerts`);
//   return res.json();
// }
const tabs = [
  { name: 'Overview', href: '#overview' },
  { name: 'Create', href: '#create' }
];

export default function AdminHomePage() {
//   const [stats, concerts] = await Promise.all([getStats(), getConcerts()]);
    const stats = {
      totalSeats: 1000,
      reserved: 350,
      cancelled: 25,
    };
    const concerts = [
      { 
        id: 1, 
        name: 'Concert A', 
        description: 'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed donec commodo morbi diam scelerisque.', 
        totalSeats: 290 
      },
      { 
        id: 2, 
        name: 'Concert B', 
        description: 'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. ', 
        totalSeats: 200 
      },
    ];

    const [activeTab, setActiveTab] = useState('Overview'); 
  
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
              {concerts.map((concert: any) => (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <ConcertListItem key={concert.id} concert={concert} onDelete={function (concertId: string | number): void {
                    throw new Error('Function not implemented.');
                  } } />
              </div>
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