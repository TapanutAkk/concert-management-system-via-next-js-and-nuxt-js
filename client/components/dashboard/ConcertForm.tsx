'use client';

import { Save, User } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { concertSchema } from '@/schemas/concertSchema'; 

const NEST_JS_API_URL = 'http://localhost:3001/concerts';

export default function ConcertForm() {

  const formMethods = useForm({
    resolver: zodResolver(concertSchema),
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setError,
    reset 
  } = formMethods;

  const onSubmit = async (formData: any) => {
    try {
        const response = await fetch(NEST_JS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(formData), 
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Concert Creation Success:", result);
            alert(`Concert Creation Success: ${result.concert.name}`);
            reset();
            
        } else if (response.status === 400) {
            console.error("Server Validation Failed (400):", result);
            
            if (result.errors && Array.isArray(result.errors)) {
                result.errors.forEach(err => {
                    setError(err.path, { 
                        type: 'server', 
                        message: err.message 
                    });
                });
            } else {
                alert('Data validation failed.');
            }

        } else if (response.status === 409) {
            console.error("Conflict Error (409):", result.message);
            setError('concertName', { 
                type: 'server', 
                message: result.message 
            });
        } else {
            console.error("Server Error:", result.message);
            alert(`Error: ${result.message || 'An unexpected error occurred.'}`);
        }

    } catch (error) {
        console.error('Network Error:', error);
        alert('Failed to connect to the server. Check network status.');
    }
  };

  return (
      <div className="py-6 border-b border-gray-200 last:border-b-0">
        <h3 className="text-3xl font-semibold text-blue-600 border-b-1 border-gray-300 pb-4 mb-4">
            Create
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="concert-name" className="block text-sm font-medium text-gray-700 mb-1">
                Concert Name
              </label>
              <input
                type="text"
                id="concert-name"
                placeholder="Please input concert name"
                {...register('concertName')} 
                className={`mt-1 block w-full border rounded-md shadow-sm p-2.5 ${
                  errors.concertName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.concertName && (
                <p className="mt-1 text-sm text-red-500">{errors.concertName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="total-seat" className="block text-sm font-medium text-gray-700 mb-1">
                Total of seat
              </label>
              <div className="relative mt-1">
                <input
                  type="number"
                  id="total-seat"
                  defaultValue="500"
                  {...register('totalSeat', { valueAsNumber: true })} 
                  className={`block w-full border rounded-md shadow-sm p-2.5 pr-10 ${
                    errors.totalSeat ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
              {errors.totalSeat && (
                <p className="mt-1 text-sm text-red-500">{errors.totalSeat.message}</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Please input description"
              {...register('description')} 
              className={`block w-full border rounded-md shadow-sm p-2.5 pr-10 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
  );
}