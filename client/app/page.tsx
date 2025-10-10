'use client';

import { useEffect, useState } from 'react';
import { getHello, postMessage } from '../services/api';

export default function HomePage() {
  const [message, setMessage] = useState('Loading...');
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [postResult, setPostResult] = useState<string | null>(null);

  useEffect(() => {
    getHello()
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        setMessage('Error connecting to Backend');
        console.error(error);
      });
  }, []);

  type ApiError = {
    response?: {
      status: number;
      data: unknown;
    };
    request?: unknown;
    message?: string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPostResult('Sending...');
      const result = await postMessage({ name, topic });
      console.log('POST Response:', result.received.name, result.received.topic);
      setPostResult(result.status + ' Received: ' + JSON.stringify(result.received));
    } catch (error) {
      const err = error as ApiError;
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        err.response
      ) {
        setPostResult(
          `POST Failed! Status: ${err.response.status}. Data: ${JSON.stringify(err.response.data)}`
        );
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'request' in error &&
        err.request
      ) {
        setPostResult('POST Error: No response received from server. Check if NestJS is running (port 3001).');
      } else {
        setPostResult('An unknown error occurred during POST request.');
      }

      console.error(error);
    }
  };

  return (
    <html>
      <body>
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
          <h1>Next.js Frontend</h1>
          <p>API GET Test Status: **{message}**</p>
          
          <hr style={{ margin: '20px 0' }} />

          <h2>API POST Test (ส่งข้อมูล)</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
            <label>ชื่อผู้ส่ง:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
                required
            />
            </div>
            <div style={{ marginBottom: '10px' }}>
            <label>หัวข้อ:</label>
            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{ marginLeft: '25px', padding: '5px' }}
                required
            />
            </div>
            <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>
            ส่งข้อมูลไป NestJS
            </button>
          </form>

          {postResult && (
              <p style={{ marginTop: '15px', border: '1px solid #ccc', padding: '10px' }}>
              **ผลลัพธ์จาก Backend:** {postResult}
              </p>
          )}
        </div>
      </body>
    </html>
  );
}