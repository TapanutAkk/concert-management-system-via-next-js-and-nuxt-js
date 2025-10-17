'use client';

import React, { useState, useEffect } from 'react';

const NEST_JS_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const CURRENT_USER_NAME = 'Jack Smile';

interface Log {
  id: string;
  userName: string;
  concertName: string;
  action: string;
  createdAt: string;
}

export default function AdminHistoryPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${NEST_JS_API_URL}/concerts/log/${CURRENT_USER_NAME}`, {
                method: 'GET',
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Failed to fetch data');
            }

            const result = await response.json();
            setLogs(result.data); 
            
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('Failed to connect to the server. Check network status.'); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="w-full overflow-x-auto shadow-lg rounded-lg bg-white p-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concert Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.createdAt}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.userName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.concertName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}