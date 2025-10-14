import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:3001`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHello = async () => {
  const response = await api.get('/');
  return response.data;
};

export const postMessage = async (data: { name: string; topic: string }) => {
  const response = await api.post('/messages', data);
  return response.data;
};